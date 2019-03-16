import { Node, Options } from "baklavajs";
import CustomSidebarOption from "./CustomSidebarOption.vue";
import RandomHelper from './randomHelper';

export default class CustomNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;

    private rng: RandomHelper|null = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
        this.addOption("Custom Distribution", Options.ButtonOption, { hure: "nutte" }, CustomSidebarOption);
    }

    public prepare() {
        // read option values
        const seed = this.getInterface("Seed").value;
        const discrete = this.getInterface("Discrete").value;
        this.rng = new RandomHelper(seed, discrete);
    }

    public calculate(index?: number) {
        this.getInterface("Output").value = index;
    }

}
