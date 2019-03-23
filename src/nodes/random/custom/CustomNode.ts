import { Node, Options } from "baklavajs";
import CustomOption from "./CustomOption.vue";
import RandomHelper from "../randomHelper";
import RandomSampler from "./randomSampler";
import CurveMonotone from "./curveMonotone";

export default class CustomNode extends Node {

    public type = "CustomNode";
    public name = this.type;

    private rng: RandomHelper|null = null;
    private defaultPoints: Array<[number, number]> = [[0, 100], [900, 100]];
    private randomSampler: RandomSampler|null = null;
    private curveMonotone: CurveMonotone|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Min", "number", Options.NumberOption, 0);
        this.addInputInterface("Max", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
        this.addOption("Custom Distribution", Options.ButtonOption, { points: this.defaultPoints}, CustomOption);
    }

    public prepare() {
        // Read option values
        const seed = this.getInterface("Seed").value;
        const discrete = this.getInterface("Discrete").value;
        const value = this.getOptionValue("Custom Distribution");

        // Set uniform random generator with seed
        this.rng = new RandomHelper(seed, false);

        // Set interpolator
        this.curveMonotone = new CurveMonotone(value.points);
        const interpolatedPoints = this.curveMonotone.curve(0,900,1);

        // Set custom random generator
        this.randomSampler = new RandomSampler(interpolatedPoints);
        this.randomSampler.calculateCdf();
    }

    public calculate(index?: number) {
        const min = this.getInterface("Min").value;
        const max = this.getInterface("Max").value;
        const uniformRandom = this.rng!.uniform(index, { fixed: 8, min: 0, max: 1 });
        const customRandom = this.randomSampler!.sample(uniformRandom);
        this.getInterface("Output").value = customRandom * (max - min) + min;
    }
}
