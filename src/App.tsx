import TopographyControls from "@/features/topography/components/topography-controls.tsx";
import Navbar from "@/components/navbar.tsx";
import TopographyCanvas from "@/features/topography/components/topography-canvas.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {type Configuration, DEFAULT_CONFIG} from "@/features/topography/types/configuration.ts";
import {useCallback, useEffect, useState} from "react";

function App() {
    const [config, setConfig] = useState<Configuration>(() => {
        const params = new URLSearchParams(window.location.search);
        const seedParam = params.get('seed');
        const seed = seedParam !== null ? parseInt(seedParam, 10) : NaN;
        return {...DEFAULT_CONFIG, seed: isNaN(seed) ? Math.floor(Math.random() * 1e9) : seed};
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('seed', String(config.seed));
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }, [config.seed]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleRandomize = useCallback(() => {
        // We just update the seed, the effect in TopoCanvas will trigger the worker
        setConfig(prev => ({...prev, seed: Math.floor(Math.random() * 1e9)}));
    }, []);

    const handleDownload = () => {
        const canvas = document.getElementById("topo-canvas") as HTMLCanvasElement;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = `topography-${config.resolution.width}x${config.resolution.height}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            <SidebarProvider>
                <AppSidebar>
                    <TopographyControls
                        config={config}
                        onConfigChange={setConfig}
                        onRandomize={handleRandomize}
                        isGenerating={isGenerating}
                        onDownload={handleDownload}
                    />
                </AppSidebar>
                <SidebarInset>
                    <Navbar/>
                    <div className={"h-full flex items-center justify-center"}>
                        <TopographyCanvas
                            config={config}
                            onGeneratingChange={setIsGenerating}
                        />
                    </div>
                </SidebarInset>
            </SidebarProvider>

        </>
    )
}

export default App
