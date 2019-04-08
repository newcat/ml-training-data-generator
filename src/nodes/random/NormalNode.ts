import { Node } from "@baklavajs/core";
import RandomHelper from "./randomHelper";

export default class NormalNode extends Node {

    public type = "NormalNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", { type: "number" });
        this.addInputInterface("Seed", "InputOption", "", { type: "string" });
        this.addInputInterface("Mean", "NumberOption", 0, { type: "number" });
        this.addInputInterface("Std. Dev.", "NumberOption", 10, { type: "number" });
        this.addInputInterface("Discrete", "CheckboxOption", true, { type: "boolean" });
    }

    public prepare() {
        const seed = this.getInterface("Seed").value;
        const discrete = this.getInterface("Discrete").value;
        this.rng = new RandomHelper(seed, discrete);
    }

    public calculate() {
        const mean = this.getInterface("Mean").value;
        const dev = this.getInterface("Std. Dev.").value;
        this.getInterface("Output").value = this.rng!.normal(this.state.index, { mean, dev });
    }

}
