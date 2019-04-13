import { Node } from "@baklavajs/core";
import RandomHelper from "../randomHelper";
import RandomSampler from "./randomSampler";
import Curve, { Vector2D } from "./curve";
import CurveStep from "./curveStep";

export default class DiscreteNode extends Node {

    public type = "DiscreteNode";
    public name = this.type;

    private rng: RandomHelper|null = null;
    private defaultValues: number[] = [];
    private defaultValue: number = 5;
    private defaultMin: number = 0;
    private defaultMax: number = 10;
    private curve: Curve|null = null;
    private randomSampler: RandomSampler|null = null;

    constructor() {
        super();
        const numOfValues = this.defaultMax - this.defaultMin;
        for (let i = 0; i <= numOfValues; i++) {
            this.defaultValues.push(this.defaultValue);
        }
        this.addOutputInterface("Output", { type: "number" });
        this.addInputInterface("Seed", "InputOption", "", { type: "string" });
        this.addInputInterface("Min", "NumberOption", this.defaultMin, { type: "number" });
        this.addInputInterface("Max", "NumberOption", this.defaultMax, { type: "number" });
        this.addOption("Discrete Distribution", "ButtonOption",
            { values: this.defaultValues }, "DiscreteRandomOption");
    }

    public prepare() {
        /*
        // Read option values
        const seed = this.getInterface("Seed").value;
        const value = this.getOptionValue("Discrete Distribution");

        // Set uniform random generator with seed
        this.rng = new RandomHelper(seed, false);

        this.curve = new CurveStep(value.points, "mid");
        const interpolatedPoints = this.curve.curve();

        // Set custom random generator
        this.randomSampler = new RandomSampler(interpolatedPoints);
        this.randomSampler.calculateCdf();
        */
    }

    public calculate() {
        /*
        const min = this.getInterface("Min").value;
        const max = this.getInterface("Max").value;

        const uniformRandom = this.rng!.uniform(this.state.index, { fixed: 8, min: 0, max: 1 });
        const discreteRandom = this.randomSampler!.sample(uniformRandom) * (max - min) + min;
        this.getInterface("Output").value = discreteRandom;
        */
       this.getInterface("Output").value = -1;
    }
}
