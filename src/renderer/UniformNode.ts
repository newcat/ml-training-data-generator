import { Node, Options } from "baklavajs";
import random from "random";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed", Options.InputOption, "seed");
        this.addOption("Min", Options.NumberOption, 0);
        this.addOption("Max", Options.NumberOption, 0);
        this.addOption("Discrete", Options.CheckboxOption, false);
    }

    public calculate() {
        const seed = this.getOptionValue("Seed");
        const min = this.getOptionValue("Min");
        const max = this.getOptionValue("Max");
        const isDiscrete = this.getOptionValue("Discrete");
        let uniform;
        if (isDiscrete) {
            uniform = random.uniformInt(Math.floor(min), Math.floor(max));
        } else {
            uniform = random.uniform(min, max);
        }
        const rand = uniform();
        this.getInterface("Output").value = rand;
        console.log(rand);
        console.log("Uniform random with min="+min+" and max="+max+" is "+rand);
    }
}