import Distribution, { Vector2D } from './distribution';

export default class DiscreteDistribution extends Distribution {

    constructor(points: Vector2D[]) {
        super(points);
    }

    interpolate(x: number) {
        const ps = this.points;
        if (x >= ps[ps.length - 1][0]) {
            return ps[ps.length - 1][1];
        }
        // Search for x
        let i = 0;
        for (i = 0; i < ps.length; i++) {
            if (x < ps[i][0]) {
                break;
            }
        }
        // Compare x with mid of current and previous x
        const m = (ps[i - 1][1] - ps[i][1]) / (ps[i - 1][0] - ps[i][0]);
        const y = m * x + ps[i][1] - m * ps[i][0];
        return y;
    }

    curve() {
        const ps = this.points;
        const data: Vector2D[] = [];
        for (let i = 0; i < ps[ps.length - 1][0]; i++) {
            data.push([i, this.interpolate(i)]);
        }
        return data;
    }

    integrate() {
        const ps = this.points;
        const cdf = this.cdf;
        cdf.push([0, 0]);
        // Calculate areas
        for (const point of ps) {
            cdf.push([
                    point[0] + 1,
                    point[1]
            ]);
        }

        // Add all previous elements to current element to get cdf
        for (let z = 1; z < cdf.length; z++) {
            cdf[z][1] += cdf[z - 1][1];
        }
    }

    sample(uniformRandom: number) {
        if (uniformRandom < 0 || uniformRandom > 1) {
            return -1;
        }

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
        // x = (y - y1) / ((y1 - y2) / (x1 - x2)) + x1
        const m = (cdf[i - 1][1] - cdf[i][1]) / (cdf[i - 1][0] - cdf[i][0]);
        const x = (random - cdf[i][1]) / m + cdf[i][0];

        return Math.floor(x);
    }
}
