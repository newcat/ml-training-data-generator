import { Node } from "@baklavajs/core";
import RandomHelper from "./randomHelper";

export default class PercentageNode extends Node {

    public type = "PercentageNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    public constructor() {
        super();
        this.addInputInterface("Value", "NumberOption", 0, { type: "number" });
        this.addInputInterface("Seed", "InputOption", "", { type: "string" });
        this.addInputInterface("Percentage", "NumberOption", 5, { type: "number" });
        this.addInputInterface("Discrete", "CheckboxOption", false, { type: "boolean" });
        this.addOutputInterface("Output", { type: "number" });
    }

    public prepare() {
        const seed = this.getInterface("Seed").value;
        this.rng = new RandomHelper(seed, false);
    }

    public calculate() {
        const p = this.getInterface("Percentage").value;
        const v = this.getInterface("Value").value;
        const discrete = this.getInterface("Discrete").value;
        const factor = this.rng!.normal(this.state.index, { mean: 0, dev: p / 200 });
        const newValue = v + v * factor;
        this.getInterface("Output").value = discrete ? Math.round(newValue) : newValue;
    }

}
