import { Vector2D } from "./curve";

export default class RandomSampler {

    distribution: Vector2D[] = [];
    cdf: Vector2D[] = [];

    constructor(points: Vector2D[]) {
        // Pass points data
        this.setDistribution(points);
    }

    setDistribution(distribution: Vector2D[]) {
        this.distribution = [];
        distribution.forEach((point) => {
            this.distribution.push([point[0], point[1]]);
        });
    }

    calculateCdf() {
        const distribution = this.distribution;
        const cdf = this.cdf;
        cdf.push([0, 0]);
        for (let z = 1; z < distribution.length; z++) {
            cdf.push([
                    distribution[z][0],
                    (distribution[z][1] + distribution[z - 1][1]) * 0.5 * (distribution[z][0] - distribution[z - 1][0])
            ]);
        }
        for (let z = 1; z < cdf.length; z++) {
            cdf[z][1] += cdf[z - 1][1];
        }
    }

    // Scale the cdf on the y-axis (vertically) for potential required visualisation stretchings
    scaleCdf(yMax: number) {
        const cdf = this.cdf;
        const factor = yMax / cdf[cdf.length - 1][1];
        cdf.forEach((point) => {
            point[1] *= factor;
        });
    }

    sample(uniformRandom: number) {
        if (uniformRandom < 0 || uniformRandom > 1) {
            return -1;
        }

        // Find the position i of random in cdf of the exact next point with bigger y
        // random will be between the array positions i and i-1
        // Following with a linear interpolation of random in this interval the actual estimated
        // x can be calculated
        const cdf = this.cdf;
        const random = uniformRandom * cdf[cdf.length - 1][1];
        let i = 0;
        for (i = 0; i < cdf.length; i++) {
            if (cdf[i][1] > random) {
                break;
            }
        }

        // Calculate corresponding x from y
        // y = ((y1 - y2) / (x2 - x2)) * x + y1 - ((y1 - y2) / (x2 - x2)) * x1 ====>
        // x = (y - y1) / /(y1 - y2) / (x2 - x2)) + x1
        const m = (cdf[i - 1][1] - cdf[i][1]) / (cdf[i - 1][0] - cdf[i][0]);
        const x = (random - cdf[i][1]) / m + cdf[i][0];

        return x / cdf[cdf.length - 1][0];
    }
}
