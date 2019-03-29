import { Node } from "@baklavajs/core";
import RandomHelper from './randomHelper';

export default class ExponentialNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", { type: "number" });
        this.addInputInterface("Seed", "InputOption", "", { type: "string" });
        this.addInputInterface("Lambda", "NumberOption", 10, { type: "number" });
        this.addInputInterface("Discrete", "CheckboxOption", true, { type: "boolean" });
    }

    public prepare() {
        // read option values
        const seed = this.getInterface("Seed").value;
        const discrete = this.getInterface("Discrete").value;
        this.rng = new RandomHelper(seed, discrete);
    }

    public calculate(index?: number) {
        const lambda = this.getInterface("Lambda").value;
        const u = this.rng!.uniform(index, { fixed: 8, min: 0, max: 1 });
        // https://stackoverflow.com/questions/2106503/pseudorandom-number-generator-exponential-distribution
        this.getInterface("Output").value = Math.log(1 - u) / (-lambda);
    }

}
