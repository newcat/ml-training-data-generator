import { Node, Options } from "baklavajs";
import random from "random";

export default class ExponentialNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed ", Options.InputOption);
        this.addOption("Lambda", Options.NumberOption);
        this.addOption("Discrete", Options.CheckboxOption, false);
    }

    public calculate() {
        const seed = this.getOptionValue("Seed");
        const lambda = this.getOptionValue("Lambda");
        const isDiscrete = this.getOptionValue("Discrete");
        let rand = random.exponential(lambda);
        if (isDiscrete) {
            rand = Math.round(rand);
        } 
        this.getInterface("Output").value = rand;
    }

}