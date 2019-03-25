import { Node, Options } from "baklavajs";
import CustomOption from "./CustomOption.vue";
import RandomHelper from "../randomHelper";
import RandomSampler from "./randomSampler";
import Curve, { Vector2D } from "./curve";
import CurveMonotone from "./curveMonotone";
import CurveLinear from "./curveLinear";
import CurveStep from "./curveStep";

export default class CustomNode extends Node {

    public type = "CustomNode";
    public name = this.type;

    private rng: RandomHelper|null = null;
    private defaultPoints: Vector2D[] = [[0, 100], [900, 100]];
    private defaultMode: string = "curveMonotone";
    private curve: Curve|null = null;
    private randomSampler: RandomSampler|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Min", "number", Options.NumberOption, 0);
        this.addInputInterface("Max", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
        this.addOption(
            "Custom Distribution",
            Options.ButtonOption,
            { points: this.defaultPoints, mode: this.defaultMode },
            CustomOption
        );
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
            case "curveStepMid": {
                this.curve = new CurveStep(value.points, "mid");
                break;
            }
            case "curveStepAfter": {
                this.curve = new CurveStep(value.points, "after");
                break;
            }
            case "curveStepBefore": {
                this.curve = new CurveStep(value.points, "before");
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

    public calculate(index?: number) {
        const min = this.getInterface("Min").value;
        const max = this.getInterface("Max").value;
        const discrete = this.getInterface("Discrete").value;

        const uniformRandom = this.rng!.uniform(index, { fixed: 8, min: 0, max: 1 });
        const customRandom = this.randomSampler!.sample(uniformRandom) * (max - min) + min;
        this.getInterface("Output").value = discrete ? Math.round(customRandom) : customRandom;
    }
}
