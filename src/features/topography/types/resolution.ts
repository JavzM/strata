export interface Resolution {
    label: string;
    width: number;
    height: number;
}

export interface ResolutionGroup {
    label: string;
    options: Resolution[];
}

export const RESOLUTIONS: ResolutionGroup[] = [
    {
        label: "Preview",
        options: [
            {label: "Preview (800x600)", width: 800, height: 600},
        ]
    },
    {
        label: "Desktop",
        options: [
            {label: "HD (1280x720)", width: 1280, height: 720},
            {label: "FHD (1920x1080)", width: 1920, height: 1080},
            {label: "QHD (2560x1440)", width: 2560, height: 1440},
            {label: "4K (3840x2160)", width: 3840, height: 2160},
            {label: "Ultrawide (3440x1440)", width: 3440, height: 1440},
        ]
    },
    {
        label: "Mobile",
        options: [
            {label: "iPhone SE (750x1334)", width: 750, height: 1334},
            {label: "Mobile Standard (1080x1920)", width: 1080, height: 1920},
            {label: "Android Tall (1080x2400)", width: 1080, height: 2400},
            {label: "iPhone 14/15 Pro (1179x2556)", width: 1179, height: 2556},
        ]
    }
];
