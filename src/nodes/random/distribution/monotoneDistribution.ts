import Distribution, { Vector2D } from "./distribution";

export default class MontoneDistribution extends Distribution {

    xs!: number[];
    ys!: number[];
    ms!: number[];
    accuracy: number = 1; // every accuracy'th xs is interpolated

    constructor(points: Vector2D[]) {
        super(points);
        // Pass data points
        const xs1 = points.map((point) => point[0]);
        const ys1 = points.map((point) => point[1]);

        // Sort xs and ys
        const xs = [];
        const ys = [];
        const is = [];
        const length = xs1.length;
        for (let i = 0; i < length; i++) {
            is.push(i);
        }
        is.sort((a, b) => xs1[a] < xs1[b] ? -1 : 1);
        for (let i = 0; i < length; i++) {
            xs.push(xs1[is[i]]);
            ys.push(ys1[is[i]]);
        }

        this.xs = xs;
        this.ys = ys;

        // Run preparation for spline interpolation
        this.prepare();
    }

    prepare() {
        const xs: number[] = this.xs;
        const ys: number[] = this.ys;
        let i: number;
        const delta: number[] = [];
        const m: number[] = [];
        const n: number = xs.length;

        // Deal with length issues
        if (xs.length !== ys.length) { throw new Error("Need an equal count of xs and ys"); }
        if (xs.length === 0) { throw new Error("Empty array"); }

        // Calculate Slopes between xi and xi+1
        for (i = 0; i < n - 1; i++) {
            delta[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
        }

        // Define tangents at control points as the average of the previous slope and the leading slope
        for (i = 1; i < n - 1; i++) {
            if (delta[i] * delta[i - 1] < 0) {
                m[i] = 0;
            } else {
                m[i] = (delta[i - 1] + delta[i]) / 2;
            }
        }

        // Set endpoints to one-sided differences
        m[0] = delta[0];
        m[n - 1] = delta[n - 2];

        // Preserve monotonicity
        for (i = 0; i < n - 1; i++) {
            if (delta[i] === 0) {
                m[i] = 0;
                m[i + 1] = 0;
            } else {
                const alpha: number = m[i] / delta[i];
                const beta: number = m[i + 1] / delta[i];
                const dist: number = Math.pow(alpha, 2) + Math.pow(beta, 2);
                const tau: number = 3 / Math.sqrt(dist);
                if (dist > 9) {
                    m[i] = tau * alpha * delta[i];
                    m[i + 1] = tau * beta * delta[i];
                }
            }
        }

        this.xs = xs;
        this.ys = ys;
        this.ms = m;
    }

    interpolate(x: number) {
        const n = this.xs.length;
        const xs = this.xs;
        const ys = this.ys;
        const ms = this.ms;

        // Find corresponding spline function
        let i = 0;
        for (i = 0; i < n; i++) {
            if (x <= xs[i]) {
                i = i - 1;
                break;
            }
        }
        // Limit i
        i = Math.max(i, 0);
        i = Math.min(i, n - 2);

        // Calculate Hermite basis functions
        const h = xs[i + 1] - xs[i];
        const t1 = (x - xs[i]) / h;
        const t2 = Math.pow(t1, 2);
        const t3 = Math.pow(t1, 3);
        const h00 =  2 * t3 - 3 * t2 + 1;
        const h10 =      t3 - 2 * t2 + t1;
        const h01 = -2 * t3 + 3 * t2;
        const h11 =      t3 -    t2;
        // Calculate the interpolation polynomial
        const y = h00 * ys[i] + h10 * h * ms[i] + h01 * ys[i + 1] + h11 * h * ms[i + 1];
        return y;
    }

    curve() {
        const data: Vector2D[] = [];
        const start = this.xs[0];
        const end = this.xs[this.xs.length - 1];
        for (let i = start; i <= end; i += this.accuracy) {
            data.push([i, this.interpolate(i)]);
        }
        return data;
    }
}
