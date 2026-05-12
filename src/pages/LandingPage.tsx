import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {Github, Monitor, SlidersHorizontal, Sparkles, ShieldCheck, ArrowRight, RefreshCw} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import ThemeToggle from "@/components/theme-toggle.tsx";
import TopographyCanvas from "@/features/topography/components/topography-canvas.tsx";
import {DEFAULT_CONFIG} from "@/features/topography/types/configuration.ts";
import {useCallback, useState} from "react";
import type {Configuration} from "@/features/topography/types/configuration.ts";
import {useTheme} from "@/providers/theme-provider.tsx";

const FEATURES = [
    {
        icon: Sparkles,
        title: "One of Its Kind",
        description:
            "We looked too. There was no dedicated tool for topographic wallpapers, so we built one. Strata fills that gap with a focused, purpose-built generator.",
    },
    {
        icon: SlidersHorizontal,
        title: "Fully Customizable",
        description:
            "Adjust terrain scale, contour density, roughness, detail layers, line width, and colors. Every parameter shapes a different world — and every result is yours.",
    },
    {
        icon: Monitor,
        title: "Every Screen, Every Size",
        description:
            "From 750×1334 mobile to 3840×2160 4K ultrawide, Strata covers all major resolutions. Download as a high-quality PNG, ready to set as your wallpaper.",
    },
    {
        icon: ShieldCheck,
        title: "No Noise. Just Lines.",
        description:
            "No account required. No subscription. No ads. Open your browser, pick your parameters, and generate. That's it.",
    },
];

const THEME_COLORS = {
    dark: {bgColor: "#0e0e11", strokeColor: "#ffffff"},
    light: {bgColor: "#f5f5f4", strokeColor: "#1c1917"},
};

const LandingPage = () => {
    const {resolvedTheme} = useTheme();

    const [previewConfig, setPreviewConfig] = useState<Configuration>(() => ({
        ...DEFAULT_CONFIG,
        seed: Math.floor(Math.random() * 1e9),
        ...THEME_COLORS[resolvedTheme],
    }));

    const [prevResolvedTheme, setPrevResolvedTheme] = useState(resolvedTheme);
    if (resolvedTheme !== prevResolvedTheme) {
        setPrevResolvedTheme(resolvedTheme);
        setPreviewConfig(prev => ({...prev, ...THEME_COLORS[resolvedTheme]}));
    }

    const handleShuffle = useCallback(() => {
        setPreviewConfig(prev => ({...prev, seed: Math.floor(Math.random() * 1e9)}));
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <title>Strata — Topographic Wallpaper Generator</title>
            <meta
                name="description"
                content="The only dedicated tool for generating topographic map wallpapers. Fully customizable, every resolution, no sign-up required."
            />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <span className="font-semibold tracking-tight">Strata</span>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/JavzM/strata"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub repository"
                        >
                            <Button variant="ghost" size="icon">
                                <Github className="size-4"/>
                            </Button>
                        </a>
                        <ThemeToggle/>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left: text */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <div
                                className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                Free &middot; No Account &middot; Open Source
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                                Topographic Wallpapers,<br className="hidden sm:block"/> Made by You.
                            </h1>
                            <p className="max-w-lg text-lg text-muted-foreground mb-10">
                                Most wallpaper sites look the same. Strata was built to fill the gap. A free,
                                dedicated generator for topographic map wallpapers. Parametric, reproducible,
                                and entirely yours.
                            </p>
                            <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto">
                                <Link to="/generate">
                                    Generate Your Wallpaper <ArrowRight className="size-4"/>
                                </Link>
                            </Button>
                        </div>

                        {/* Right: live canvas — desktop only */}
                        <div className="relative group hidden lg:flex justify-end">
                            <div className="relative rounded-2xl shadow-2xl ring-1 ring-white/10">
                                <TopographyCanvas
                                    config={previewConfig}
                                    maxDisplayWidth={440}
                                    maxDisplayHeight={410}
                                    canvasId="topo-canvas-preview"
                                />
                                <button
                                    onClick={handleShuffle}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-sm border px-3 py-1.5 text-xs cursor-pointer hover:bg-background"
                                >
                                    <RefreshCw className="size-3"/> Shuffle
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator/>

                {/* Features */}
                <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20">
                    <h2 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8 sm:mb-12">
                        Why Strata
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-8">
                        {FEATURES.map(({icon: Icon, title, description}) => (
                            <div key={title} className="flex flex-col gap-3 rounded-2xl border p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
                                        <Icon className="size-4"/>
                                    </div>
                                    <h3 className="font-semibold">{title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <Separator/>

                {/* CTA Banner */}
                <section
                    className="max-w-6xl mx-auto px-6 py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center gap-6">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to generate?</h2>
                    <p className="text-muted-foreground max-w-sm">
                        No setup, no sign-up. Just open the app and start creating.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto">
                        <Link to="/generate">
                            Generate Your Wallpaper <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t">
                <div
                    className="max-w-7xl mx-auto px-6 py-4 sm:h-14 sm:py-0 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <span>© {new Date().getFullYear()} — Javier Martínez</span>
                    <a
                        href="https://github.com/JavzM/strata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                        <Github className="size-3.5"/> GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
