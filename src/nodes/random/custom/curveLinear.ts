import Curve from "./curve";

export default class CurveLinear implements Curve {

    xs!: number[];
    ys!: number[];

    constructor(points: Array<[number, number]>) {
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
        // Pass to attributes
        this.xs = xs;
        this.ys = ys;
    }

    interpolate(x: number) {
        const xs = this.xs;
        const ys = this.ys;

        if (x >= xs[xs.length - 1]) {
            return ys[ys.length - 1];
        }
        // Search for x
        let i = 0;
        for (i = 0; i < xs.length; i++) {
            if (x < xs[i]) {
                break;
            }
        }
        // Compare x with mid of current and previous x
        const m = (ys[i - 1] - ys[i]) / (xs[i - 1] - xs[i]);
        const y = m * x + ys[i] - m * xs[i];
        return y;
    }

    curve() {
        const xs = this.xs;
        const ys = this.ys;
        const data: Array<[number, number]> = [];
        for (let i = 0; i < xs.length; i++) {
            data.push([xs[i], ys[i]]);
        }
        return data;
    }
}
