import { Node } from "@baklavajs/core";
import RandomHelper from "./randomHelper";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", { type: "number" });
        this.addInputInterface("Seed", "InputOption", { type: "string" });
        this.addInputInterface("Min", "NumberOption", 0, { type: "number" });
        this.addInputInterface("Max", "NumberOption", 10, { type: "number" });
        this.addInputInterface("Discrete", "CheckboxOption", true, { type: "boolean" });
    }

    public prepare() {
        const seed = this.getInterface("Seed").value;
        const discrete = this.getInterface("Discrete").value;
        this.rng = new RandomHelper(seed, discrete);
    }

    public calculate(index?: number) {
        const min = this.getInterface("Min").value;
        const max = this.getInterface("Max").value;
        this.getInterface("Output").value = this.rng!.uniform(index, { min, max, fixed: 8 });
    }

}
