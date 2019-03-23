export default abstract class Curve {

    xs!: number[];
    ys!: number[];

    constructor(points: Array<[number, number]>) {
        // Pass data points
        this.xs = points.map((point) => point[0] );
        this.ys = points.map((point) => point[1] );
        this.prepare();
    }

    abstract prepare(): void;

    abstract interpolate(x: number): number;

    abstract curve(): Array<[number, number]>;

}
