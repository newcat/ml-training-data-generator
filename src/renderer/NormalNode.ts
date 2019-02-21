import { Node, Options } from "baklavajs";
import random from "random";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed ", Options.InputOption);
        this.addOption("Mu", Options.NumberOption);
        this.addOption("Sigma", Options.NumberOption);
        this.addOption("Discrete", Options.CheckboxOption, false);
    }

    public calculate() {
        const seed = this.getOptionValue("Seed");
        const mu = this.getOptionValue("Mu");
        const sigma = this.getOptionValue("Sigma");
        const isDiscrete = this.getOptionValue("Discrete");
        let rand = random.normal(mu, sigma);;
        if (isDiscrete) {
            rand = Math.round(rand);
        } 
        this.getInterface("Output").value = rand;
    }

}