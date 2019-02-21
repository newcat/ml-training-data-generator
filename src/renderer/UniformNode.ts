import { Node, Options } from "baklavajs";
import random from "random";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed", Options.InputOption);
        this.addOption("Min", Options.NumberOption);
        this.addOption("Max", Options.NumberOption);
        this.addOption("Discrete", Options.CheckboxOption, false);
    }

    public calculate() {
        const seed = this.getOptionValue("Seed");
        const min = this.getOptionValue("Min");
        const max = this.getOptionValue("Max");
        const isDiscrete = this.getOptionValue("Discrete");
        let rand = 0;
        if (isDiscrete) {
            rand = random.uniformInt(Math.floor(min), Math.floor(max));
        } else {
            rand = random.uniformInt(min, max);
        }
        this.getInterface("Output").value = rand;
    }
}