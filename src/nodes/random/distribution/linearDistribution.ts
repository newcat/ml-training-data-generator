import Distribution, { Vector2D } from './distribution';

export default class LinearDistribution extends Distribution {

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
}
