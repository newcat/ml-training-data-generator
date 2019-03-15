import { Node, Options } from "baklavajs";
import RandomHelper from "./randomHelper";

export default class NormalNode extends Node {

    public type = "NormalNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Mean", "number", Options.NumberOption, 0);
        this.addInputInterface("Std. Dev.", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
    }

    public prepare() {
        const seed = this.getInterface("Seed").value;
        const discrete = this.getInterface("Discrete").value;
        this.rng = new RandomHelper(seed, discrete);
    }

    public calculate(index?: number) {
        const mean = this.getInterface("Mean").value;
        const dev = this.getInterface("Std. Dev.").value;
        this.getInterface("Output").value = this.rng!.normal(index, { mean, dev });
    }

}
