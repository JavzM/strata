/**
 * Inverse linear interpolation to find the t value where the value equals the level.
 */
export function inverseLerp(a: number, b: number, level: number) {
    if (Math.abs(b - a) < 1e-5) return 0.5;
    return (level - a) / (b - a);
}

/**
 * Converts a hex color string to an RGB object.
 */
export function hexToRgb(hex: string) {
    const cleanHex = hex.replace('#', '');
    return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16)
    };
}
