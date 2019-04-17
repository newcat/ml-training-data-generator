import { Node } from "@baklavajs/core";
import RandomHelper from "../randomHelper";
import Distribution from "../distribution/distribution";
import DiscreteDistribution from "../distribution/discreteDistribution";

export default class DiscreteNode extends Node {

    public type = "DiscreteNode";
    public name = this.type;

    private rng: RandomHelper|null = null;
    private defaultValues: number[] = [];
    private defaultValue: number = 5;
    private defaultMin: number = 0;
    private defaultMax: number = 10;
    private min: number = 0;
    private distribution: Distribution|null = null;

    constructor() {
        super();
        // Fill with default values
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
        // Read option values
        const seed = this.getInterface("Seed").value;
        const value = this.getOptionValue("Discrete Distribution");
        this.min = this.getInterface("Min").value;
        const values = value.values;

        // Set uniform random generator with seed
        this.rng = new RandomHelper(seed, false);

        // Transform values to actual points
        const points = values.map((val: number, index: number) => [index, val]);

        // Set custom random generator
        this.distribution = new DiscreteDistribution(points);
        this.distribution.integrate(this.distribution.points);
    }

    public calculate() {
        const uniformRandom = this.rng!.uniform(this.state.index, { fixed: 8, min: 0, max: 1 });
        const discreteRandom = this.distribution!.sample(uniformRandom);
        this.getInterface("Output").value = discreteRandom + this.min;
    }
}
