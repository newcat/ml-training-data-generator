import { Node } from "@baklavajs/core";
import RandomHelper from "../randomHelper";
import RandomSampler from "./randomSampler";
import Curve, { Vector2D } from "./curve";
import CurveMonotone from "./curveMonotone";
import CurveLinear from "./curveLinear";

export default class CustomNode extends Node {

    public type = "CustomNode";
    public name = this.type;

    private rng: RandomHelper|null = null;
    private defaultPoints: Vector2D[] = [[0, 0], [50, 50], [100, 20]];
    private defaultMode: string = "curveMonotone";
    private curve: Curve|null = null;
    private randomSampler: RandomSampler|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", { type: "number" });
        this.addInputInterface("Seed", "InputOption", "", { type: "string" });
        this.addInputInterface("Min", "NumberOption", 0, { type: "number" });
        this.addInputInterface("Max", "NumberOption", 10, { type: "number" });
        this.addInputInterface("Discrete", "CheckboxOption", true, { type: "boolean" });
        this.addOption("Custom Distribution", "ButtonOption",
            { points: this.defaultPoints, mode: this.defaultMode }, "CustomRandomOption");
    }

    public prepare() {
        // Read option values
        const seed = this.getInterface("Seed").value;
        const value = this.getOptionValue("Custom Distribution");

        // Set uniform random generator with seed
        this.rng = new RandomHelper(seed, false);

        // Set curve interpolator
        switch (value.mode) {
            case "curveMonotone": {
                this.curve = new CurveMonotone(value.points);
                break;
            }
            case "curveLinear": {
                this.curve = new CurveLinear(value.points);
                break;
            }
            default: {
                throw new Error("Invalid mode");
            }
        }
        const interpolatedPoints = this.curve!.curve();

        // Set custom random generator
        this.randomSampler = new RandomSampler(interpolatedPoints);
        this.randomSampler.calculateCdf();
    }

    public calculate() {
        const min = this.getInterface("Min").value;
        const max = this.getInterface("Max").value;
        const discrete = this.getInterface("Discrete").value;

        const uniformRandom = this.rng!.uniform(this.state.index, { fixed: 8, min: 0, max: 1 });
        const customRandom = this.randomSampler!.sample(uniformRandom) * (max - min) + min;
        this.getInterface("Output").value = discrete ? Math.round(customRandom) : customRandom;
    }
}
