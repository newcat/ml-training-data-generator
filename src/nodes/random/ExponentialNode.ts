import { Node } from "@baklavajs/core";
import RandomHelper from './randomHelper';

export default class ExponentialNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;

    private rng: RandomHelper|null = null;
    private discrete = false;

    constructor() {
        super();
        this.addOutputInterface("Output", { type: "number" });
        this.addInputInterface("Seed", "InputOption", "", { type: "string" });
        this.addInputInterface("Lambda", "NumberOption", 0.1, { type: "number" });
        this.addInputInterface("Discrete", "CheckboxOption", true, { type: "boolean" });
    }

    public prepare() {
        // read option values
        const seed = this.getInterface("Seed").value;
        this.discrete = this.getInterface("Discrete").value;
        // discrete has to be false because a uniform random number is about to get mapped
        // to exponential distribution, rounding shouldnt be done here, instead in the end,
        // after the value has been mapped
        this.rng = new RandomHelper(seed, false);
    }

    public calculate() {
        const lambda = this.getInterface("Lambda").value;
        const u = this.rng!.uniform(this.state.index, { fixed: 8, min: 0, max: 1 });
        // https://stackoverflow.com/questions/2106503/pseudorandom-number-generator-exponential-distribution
        const e = Math.log(1 - u) / (-lambda);
        this.getInterface("Output").value = this.discrete ? Math.floor(e) : e;
    }

}
