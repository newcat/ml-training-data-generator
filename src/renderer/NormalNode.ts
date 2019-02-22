import { Node, Options } from "baklavajs";
import random from "random";

export default class NormalNode extends Node {

    public type = "NormalNode";
    public name = this.type;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed", Options.InputOption, "thisisanexampleseed");
        this.addOption("Mu", Options.NumberOption, 0);
        this.addOption("Sigma", Options.NumberOption, 1);
        this.addOption("Discrete", Options.CheckboxOption, false);
    }

    public calculate() {
        const seed = this.getOptionValue("Seed");
        const mu = this.getOptionValue("Mu");
        const sigma = this.getOptionValue("Sigma");
        const isDiscrete = this.getOptionValue("Discrete");
        const normal = random.normal(mu, sigma);;
        let rand = normal();
        if (isDiscrete) {
            rand = Math.round(rand);
        }
        this.getInterface("Output").value = rand;
        console.log("Normal random with mu="+mu+" and sigma="+sigma+" is "+rand);
    }

}