import Sort from "./quickSort";
export type Vector2D = [number, number];

export default abstract class Distribution {

    points: Vector2D[] = [];
    cdf: Vector2D[] = [];

    constructor(points: Vector2D[]) {
        this.points = points.map((point) => [point[0], point[1]]);
        Sort(this.points, 0, this.points.length - 1);
    }

    abstract interpolate(x: number): number;

    abstract curve(): Vector2D[];

    integrate(curve: Vector2D[]): void {
        const ps = curve;
        const cdf: Vector2D[] = [];
        cdf.push([0, 0]);
        // Calculate areas
        for (let z = 1; z < ps.length; z++) {
            cdf.push([
                ps[z][0],
                // Calculate area between x = z-1 and x = z with trapez formula
                (ps[z][1] + ps[z - 1][1]) * 0.5 * (ps[z][0] - ps[z - 1][0])
            ]);
        }
        // Calculate sum of z-th and z-1-th element
        for (let z = 1; z < cdf.length; z++) {
            cdf[z][1] += cdf[z - 1][1];
        }
        this.cdf = cdf;
    }

    sample(uniformRandom: number): number {
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

        try {
            // Calculate corresponding x from y
            // y = ((y1 - y2) / (x2 - x2)) * x + y1 - ((y1 - y2) / (x2 - x2)) * x1 ====>
            // x = (y - y1) / ((y1 - y2) / (x1 - x2)) + x1
            const m = (cdf[i - 1][1] - cdf[i][1]) / (cdf[i - 1][0] - cdf[i][0]);
            const x = (random - cdf[i][1]) / m + cdf[i][0];
            return x / this.cdf[this.cdf.length - 1][0];
        } catch (err) {
            throw new Error("Couldn't calculate sample value - i is out of bounds or division with zero");
        }
    }

}
