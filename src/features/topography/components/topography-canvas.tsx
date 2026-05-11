import type {Configuration} from "@/features/topography/types/configuration.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {hexToRgb} from "@/features/topography/utils/marchingSquares.ts";
import {Spinner} from "@/components/ui/spinner.tsx";

type Path = { level: number; segments: number[] };

interface Props {
    config: Configuration;
    onGeneratingChange?: (isGenerating: boolean) => void;
}

const MAX_PREVIEW_WIDTH = 900;
const MAX_PREVIEW_HEIGHT = 700;

const TopographyCanvas = ({config, onGeneratingChange}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const lastPathsRef = useRef<Path[] | null>(null);
    const drawRef = useRef<((paths: Path[]) => void) | null>(null);
    const onGeneratingChangeRef = useRef(onGeneratingChange);
    const generationIdRef = useRef(0);
    const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showSpinner, setShowSpinner] = useState(false);

    // Keep callback refs in sync so worker handler always calls the latest version
    useEffect(() => {
        onGeneratingChangeRef.current = onGeneratingChange;
    });

    const drawPaths = useCallback((paths: Path[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const targetWidth = config.resolution.width * dpr;
        const targetHeight = config.resolution.height * dpr;

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }

        const aspectRatio = config.resolution.width / config.resolution.height;
        let displayWidth = MAX_PREVIEW_WIDTH;
        let displayHeight = MAX_PREVIEW_WIDTH / aspectRatio;

        if (displayHeight > MAX_PREVIEW_HEIGHT) {
            displayHeight = MAX_PREVIEW_HEIGHT;
            displayWidth = MAX_PREVIEW_HEIGHT * aspectRatio;
        }

        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, config.resolution.width, config.resolution.height);

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
    }, [config.bgColor, config.strokeColor, config.lineWidth, config.resolution]);

    // Keep drawRef in sync so the worker handler always calls the latest drawPaths
    useEffect(() => {
        drawRef.current = drawPaths;
    });

    // Worker init — runs once; uses refs so it never needs to be recreated
    useEffect(() => {
        const worker = new Worker(
            new URL('../workers/topo-worker.ts', import.meta.url),
            {type: 'module'}
        );

        worker.onmessage = (e) => {
            const {paths, id, error} = e.data;

            if (spinnerTimerRef.current) {
                clearTimeout(spinnerTimerRef.current);
                spinnerTimerRef.current = null;
            }

            if (error) {
                console.error(error);
                setShowSpinner(false);
                onGeneratingChangeRef.current?.(false);
                return;
            }

            // Discard results from superseded generations
            if (id !== generationIdRef.current) return;

            lastPathsRef.current = paths;
            drawRef.current?.(paths);
            setShowSpinner(false);
            onGeneratingChangeRef.current?.(false);
        };

        workerRef.current = worker;
        return () => worker.terminate();
    }, []);

    // Generation params → worker, debounced to coalesce rapid slider changes
    useEffect(() => {
        const id = ++generationIdRef.current;
        const tid = setTimeout(() => {
            if (!workerRef.current) return;
            onGeneratingChangeRef.current?.(true);
            workerRef.current.postMessage({
                config,
                width: config.resolution.width,
                height: config.resolution.height,
                id,
            });
            // Only show spinner if generation takes longer than 300ms
            spinnerTimerRef.current = setTimeout(() => setShowSpinner(true), 300);
        }, 16);
        return () => clearTimeout(tid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.seed, config.scale, config.roughness, config.octaves, config.step, config.resolution.width, config.resolution.height]);

    // Style params → instant redraw, no worker needed
    useEffect(() => {
        if (lastPathsRef.current) drawPaths(lastPathsRef.current);
    }, [drawPaths]);

    return (
        <div className="relative w-fit h-fit overflow-auto p-2">
            <canvas
                className={"border rounded-2xl"}
                ref={canvasRef}
                id="topo-canvas"
                style={{opacity: showSpinner ? 0.5 : 1, transition: 'opacity 0.3s'}}
            />
            {showSpinner && (
                <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                    <Spinner className={"size-10"}/>
                </div>
            )}
        </div>
    );
};

export default TopographyCanvas;
