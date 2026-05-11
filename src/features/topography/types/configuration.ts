import {type Resolution, RESOLUTIONS} from "@/features/topography/types/resolution.ts";

export type Configuration = {
    resolution: Resolution;
    scale: number;
    step: number; // Distance between contour lines (height difference)
    roughness: number;
    lineWidth: number;
    seed: number;
    octaves: number;
    bgColor: string;
    strokeColor: string;
};

export const DEFAULT_CONFIG: Configuration = {
    resolution: RESOLUTIONS[0].options[0],
    scale: 0.004,
    step: 0.1,
    roughness: 0.5,
    lineWidth: 1,
    seed: Math.floor(Math.random() * 1e9),
    octaves: 4,
    bgColor: "#0e0e11",
    strokeColor: "#ffffff",
};
