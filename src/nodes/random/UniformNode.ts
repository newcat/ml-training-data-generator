import { Node, Options } from "baklavajs";
import RandomHelper from "./randomHelper";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Min", "number", Options.NumberOption, 0);
        this.addInputInterface("Max", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
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
