export type Vector2D = [number, number];

export default abstract class Curve {

    xs!: number[];
    ys!: number[];

    constructor(points: Vector2D[]) {
        // Pass data points
        this.xs = points.map((point) => point[0] );
        this.ys = points.map((point) => point[1] );
        this.prepare();
    }

    abstract prepare(): void;

    abstract interpolate(x: number): number;

    abstract curve(): Vector2D[];

}
