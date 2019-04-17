import Distribution, { Vector2D } from "./distribution";

export default class MontoneDistribution extends Distribution {

    c1s!: number[];
    c2s!: number[];
    c3s!: number[];
    accuracy: number = 1; // every accuracy'th x is interpolated

    constructor(points: Vector2D[]) {
        super(points);
        this.prepare();
    }

    prepare() {
        // Get consecutive differences and slopes
        const ps = this.points;
        const dys = [];
        const dxs = [];
        const ms = [];
        for (let i = 0; i < ps.length - 1; i++) {
            const dx = ps[i + 1][0] - ps[i][0];
            const dy = ps[i + 1][1] - ps[i][1];
            dxs.push(dx);
            dys.push(dy);
            ms.push(dy / dx);
        }

        // Get degree-1 coefficients
        const c1s = [ms[0]];
        for (let i = 0; i < dxs.length - 1; i++) {
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
        for (let i = 0; i < c1s.length - 1; i++) {
            const c1 = c1s[i];
            const m = ms[i];
            const invDx = 1 / dxs[i];
            const common = c1 + c1s[i + 1] - m - m;
            c2s.push((m - c1 - common) * invDx);
            c3s.push(common * invDx * invDx);
        }

        this.c1s = c1s;
        this.c2s = c2s;
        this.c3s = c3s;
    }

    interpolate(x: number) {
        const ps = this.points;
        const c1s = this.c1s;
        const c2s = this.c2s;
        const c3s = this.c3s;

        // The rightmost point in the dataset should give an exact result
        let i = ps.length - 1;
        if (x === ps[i][0]) {
            return ps[i][1];
        }

        // Search for the interval x is in, returning the corresponding y if x is one of the original xs
        let low = 0;
        let mid = 0;
        let high = c3s.length - 1;
        while (low <= high) {
            mid = Math.floor(0.5 * (low + high));
            const xHere = ps[mid][0];
            if (xHere < x) {
                low = mid + 1;
            } else if (xHere > x) {
                high = mid - 1;
            } else {
                return ps[mid][1];
            }
        }
        i = Math.max(0, high);

        // Interpolate
        const diff = x - ps[i][0];
        const diffSq = diff * diff;
        return ps[i][1] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
    }

    curve() {
        const ps = this.points;
        const data: Vector2D[] = [];
        const start = ps[0][0];
        const end = ps[ps.length - 1][0];
        for (let i = start; i <= end; i += this.accuracy) {
            data.push([i, this.interpolate(i)]);
        }
        return data;
    }

}
