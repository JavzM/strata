import type {Configuration} from "@/features/topography/types/configuration.ts";
import {useEffect, useRef, useState} from "react";
import {hexToRgb} from "@/features/topography/utils/marchingSquares.ts";
import {Spinner} from "@/components/ui/spinner.tsx";

interface Props {
    config: Configuration;
    onGeneratingChange?: (isGenerating: boolean) => void;
}

const MAX_PREVIEW_WIDTH = 900;
const MAX_PREVIEW_HEIGHT = 700;


const TopographyCanvas = ({config, onGeneratingChange}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const [isWorkerBusy, setIsWorkerBusy] = useState(false);
    // Store the last paths to redraw when only colors change
    const [lastPaths, setLastPaths] = useState<{ level: number, segments: number[] }[] | null>(null);

    const drawPaths = (paths: { level: number, segments: number[] }[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Setup Canvas Dimensions
        const dpr = window.devicePixelRatio || 1;

        // Check if canvas size needs update
        const targetWidth = config.resolution.width * dpr;
        const targetHeight = config.resolution.height * dpr;

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }

        // CSS display size
        const aspectRatio = config.resolution.width / config.resolution.height;
        let displayWidth = MAX_PREVIEW_WIDTH;
        let displayHeight = MAX_PREVIEW_WIDTH / aspectRatio;

        if (displayHeight > MAX_PREVIEW_HEIGHT) {
            displayHeight = MAX_PREVIEW_HEIGHT;
            displayWidth = MAX_PREVIEW_HEIGHT * aspectRatio;
        }

        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // RESET TRANSFORM before applying new scale
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        // 2. Draw Background
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, config.resolution.width, config.resolution.height);

        // 3. Draw Paths
        ctx.lineWidth = config.lineWidth;
        const rgb = hexToRgb(config.strokeColor);

        paths.forEach(({level, segments}) => {
            const opacity = 0.1 + (level + 0.8) * 0.3;
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(opacity, 0.8)})`;

            ctx.beginPath();
            for (let i = 0; i < segments.length; i += 4) {
                ctx.moveTo(segments[i], segments[i + 1]);
                ctx.lineTo(segments[i + 2], segments[i + 3]);
            }
            ctx.stroke();
        });
    };

    useEffect(() => {
        // Initialize worker
        workerRef.current = new Worker(new URL('../workers/topo-worker.ts', import.meta.url), {type: 'module'});

        workerRef.current.onmessage = (e) => {
            const {paths, error} = e.data;

            if (error) {
                console.error(error);
                setIsWorkerBusy(false);
                onGeneratingChange?.(false);
                return;
            }

            setLastPaths(paths);
            setIsWorkerBusy(false);
            onGeneratingChange?.(false);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, [onGeneratingChange]);

    // Effect for heavy recalculations (Worker)
    useEffect(() => {
        if (!workerRef.current) return;

        const timer = requestAnimationFrame(() => {
            setIsWorkerBusy(true);
            onGeneratingChange?.(true);
        });

        // Send work to worker
        workerRef.current.postMessage({
            config,
            width: config.resolution.width,
            height: config.resolution.height
        });

        return () => cancelAnimationFrame(timer);

    }, [config.seed, config.scale, config.roughness, config.octaves, config.step, config.resolution.width, config.resolution.height, onGeneratingChange, config]);


    // Effect for fast redraws (Colors, Line Width)
    useEffect(() => {
        if (lastPaths) {
            drawPaths(lastPaths);
        }
    }, [
        lastPaths,
        config.bgColor,
        config.strokeColor,
        config.lineWidth,
        config.resolution // Need to resize canvas if resolution changes
    ]);
    return (
        <div className="relative w-fit h-fit overflow-auto p-2">
            <canvas
                className={"border rounded-2xl"}
                ref={canvasRef}
                id="topo-canvas"
                style={{opacity: isWorkerBusy ? 0.5 : 1, transition: 'opacity 0.2s'}}
            />
            {isWorkerBusy && (
                <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                    <Spinner className={"size-10"}/>
                </div>
            )}
        </div>
    );
}

export default TopographyCanvas