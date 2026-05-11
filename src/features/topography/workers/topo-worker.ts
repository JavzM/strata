import {createNoise2D} from 'simplex-noise';
import {mulberry32} from "../utils/noise.ts";
import {inverseLerp} from "../utils/marchingSquares.ts";

const GRID_SIZE = 4;

self.onmessage = (e: MessageEvent) => {
    const {config, width, height, id} = e.data;

    try {
        // 1. Setup Noise
        const noise2D = createNoise2D(mulberry32(config.seed * 1e9));

        // 2. Generate Height Map
        const cols = Math.ceil(width / GRID_SIZE) + 1;
        const rows = Math.ceil(height / GRID_SIZE) + 1;
        const grid = new Float32Array(cols * rows);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * GRID_SIZE;
                const y = j * GRID_SIZE;
                const nx = x * config.scale;
                const ny = y * config.scale;

                let h = 0;
                let amp = 0.5;
                let freq = 1;

                for (let o = 0; o < config.octaves; o++) {
                    h += noise2D(nx * freq, ny * freq) * amp;
                    amp *= config.roughness;
                    freq *= 2;
                }

                grid[j * cols + i] = h;
            }
        }

        // 3. Generate Paths (Marching Squares)
        // Instead of drawing directly, we'll collect line segments grouped by level
        // This allows us to send data back to main thread to draw
        const paths: { level: number, segments: number[] }[] = [];

        for (let level = -0.8; level <= 0.8; level += config.step) {
            const currentLevelSegments: number[] = []; // [x1, y1, x2, y2, x3, y3, x4, y4...]

            for (let j = 0; j < rows - 1; j++) {
                for (let i = 0; i < cols - 1; i++) {
                    const idx = j * cols + i;

                    const v0 = grid[idx];
                    const v1 = grid[idx + 1];
                    const v2 = grid[idx + cols + 1];
                    const v3 = grid[idx + cols];

                    let caseIdx = 0;
                    if (v0 >= level) caseIdx |= 1;
                    if (v1 >= level) caseIdx |= 2;
                    if (v2 >= level) caseIdx |= 4;
                    if (v3 >= level) caseIdx |= 8;

                    if (caseIdx === 0 || caseIdx === 15) continue;

                    const x = i * GRID_SIZE;
                    const y = j * GRID_SIZE;

                    const tTop = inverseLerp(v0, v1, level);
                    const tRight = inverseLerp(v1, v2, level);
                    const tBottom = inverseLerp(v3, v2, level);
                    const tLeft = inverseLerp(v0, v3, level);

                    const pTop = [x + tTop * GRID_SIZE, y];
                    const pRight = [x + GRID_SIZE, y + tRight * GRID_SIZE];
                    const pBottom = [x + tBottom * GRID_SIZE, y + GRID_SIZE];
                    const pLeft = [x, y + tLeft * GRID_SIZE];

                    // Helper to add segment
                    const addLine = (p1: number[], p2: number[]) => {
                        currentLevelSegments.push(p1[0], p1[1], p2[0], p2[1]);
                    };

                    switch (caseIdx) {
                        case 1:
                            addLine(pLeft, pTop);
                            break;
                        case 2:
                            addLine(pTop, pRight);
                            break;
                        case 3:
                            addLine(pLeft, pRight);
                            break;
                        case 4:
                            addLine(pRight, pBottom);
                            break;
                        case 5:
                            addLine(pLeft, pTop);
                            addLine(pRight, pBottom);
                            break;
                        case 6:
                            addLine(pTop, pBottom);
                            break;
                        case 7:
                            addLine(pLeft, pBottom);
                            break;
                        case 8:
                            addLine(pLeft, pBottom);
                            break;
                        case 9:
                            addLine(pTop, pBottom);
                            break;
                        case 10:
                            addLine(pTop, pRight);
                            addLine(pLeft, pBottom);
                            break;
                        case 11:
                            addLine(pRight, pBottom);
                            break;
                        case 12:
                            addLine(pLeft, pRight);
                            break;
                        case 13:
                            addLine(pTop, pRight);
                            break;
                        case 14:
                            addLine(pLeft, pTop);
                            break;
                    }
                }
            }

            if (currentLevelSegments.length > 0) {
                paths.push({level, segments: currentLevelSegments});
            }
        }

        self.postMessage({paths, id});

    } catch (error) {
        console.error("Worker error:", error);
        self.postMessage({error: "Generation failed", id});
    }
};
