import { Node, Options } from "baklavajs";
import RandomHelper from "./randomHelper";

export default class PercentageNode extends Node {

    public type = "PercentageNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    public constructor() {
        super();
        this.addInputInterface("Value", "number", Options.NumberOption, 0);
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Percentage", "number", Options.NumberOption, 5);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, false);
        this.addOutputInterface("Output", "number");
    }

    public prepare() {
        const seed = this.getInterface("Seed").value;
        this.rng = new RandomHelper(seed, false);
    }

    public calculate(index?: number) {
        const p = this.getInterface("Percentage").value;
        const v = this.getInterface("Value").value;
        const discrete = this.getInterface("Discrete").value;
        const factor = this.rng!.normal(index, { mean: 0, dev: p / 200 });
        const newValue = v + v * factor;
        this.getInterface("Output").value = discrete ? Math.round(newValue) : newValue;
    }

}
