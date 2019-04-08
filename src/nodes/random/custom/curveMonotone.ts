import Curve, { Vector2D } from "./curve";

export default class CurveMonotone implements Curve {

    xs!: number[];
    ys!: number[];
    c1s!: number[];
    c2s!: number[];
    c3s!: number[];
    accuracy: number = 1; // every accuracy'th x is interpolated

    constructor(points: Vector2D[]) {
        // Pass data points
        this.xs = points.map((point) => point[0] );
        this.ys = points.map((point) => point[1] );
        this.prepare();
    }

    prepare() {
        let xs = this.xs.slice();
        let ys = this.ys.slice();
        let i;
        const length = xs.length;

        // Deal with length issues
        if (length !== ys.length) { throw new Error('Need an equal count of xs and ys.'); }
        if (length === 0) { throw new Error('Empty array.'); }

        // Rearrange xs and ys so that xs is sorted
        const indexes = [];
        for (i = 0; i < length; i++) {
            indexes.push(i);
        }
        indexes.sort((a, b) => {
            return xs[a] < xs[b] ? -1 : 1;
        });
        const oldXs = xs;
        const oldYs = ys;
        // Creating new arrays also prevents problems if the input arrays are mutated later
        xs = []; ys = [];
        // Unary plus properly converts values to numbers
        for (i = 0; i < length; i++) {
            xs.push(+oldXs[indexes[i]]);
            ys.push(+oldYs[indexes[i]]);
        }

        // Get consecutive differences and slopes
        const dys = [];
        const dxs = [];
        const ms = [];
        for (i = 0; i < length - 1; i++) {
            const dx = xs[i + 1] - xs[i];
            const dy = ys[i + 1] - ys[i];
            dxs.push(dx);
            dys.push(dy);
            ms.push(dy / dx);
        }

        // Get degree-1 coefficients
        const c1s = [ms[0]];
        for (i = 0; i < dxs.length - 1; i++) {
            const m = ms[i];
            const mNext = ms[i + 1];
            if (m * mNext <= 0) {
                c1s.push(0);
            } else {
                const dx = dxs[i];
                const dxNext = dxs[i + 1];
                const common = dx + dxNext;
                c1s.push(3 * common / ((common + dxNext) / m + (common + dx) / mNext));
            }
        }
        c1s.push(ms[ms.length - 1]);

        // Get degree-2 and degree-3 coefficients
        const c2s: any = [];
        const c3s: any = [];
        for (i = 0; i < c1s.length - 1; i++) {
            const c1 = c1s[i];
            const m = ms[i];
            const invDx = 1 / dxs[i];
            const common = c1 + c1s[i + 1] - m - m;
            c2s.push((m - c1 - common) * invDx);
            c3s.push(common * invDx * invDx);
        }

        this.xs = xs;
        this.ys = ys;
        this.c1s = c1s;
        this.c2s = c2s;
        this.c3s = c3s;
    }

    interpolate(x: number) {
        const xs = this.xs;
        const ys = this.ys;
        const c1s = this.c1s;
        const c2s = this.c2s;
        const c3s = this.c3s;

        // The rightmost point in the dataset should give an exact result
        let i = xs.length - 1;
        if (x === xs[i]) {
            return ys[i];
        }

        // Search for the interval x is in, returning the corresponding y if x is one of the original xs
        let low = 0;
        let mid = 0;
        let high = c3s.length - 1;
        while (low <= high) {
            mid = Math.floor(0.5 * (low + high));
            const xHere = xs[mid];
            if (xHere < x) {
                low = mid + 1;
            } else if (xHere > x) {
                high = mid - 1;
            } else {
                return ys[mid];
            }
        }
        i = Math.max(0, high);

        // Interpolate
        const diff = x - xs[i];
        const diffSq = diff * diff;
        return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
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
