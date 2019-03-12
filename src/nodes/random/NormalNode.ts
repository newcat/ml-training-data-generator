import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";
import { IPreparationData } from "@/types";

export default class NormalNode extends Node {

    public type = "NormalNode";
    public name = this.type;
    private generator: any = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Mu", "number", Options.NumberOption, 0);
        this.addInputInterface("Sigma", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
    }

    public prepare(data: IPreparationData) {
        // read option values
        const seed = this.getInterface("Seed").value;
        const mu = this.getInterface("Mu").value;
        const sigma = this.getInterface("Sigma").value;

        // create new independent random number generator
        const myRandom = random.clone();
        myRandom.use(seed ? seedrandom(seed + data.seed) : seedrandom());
        this.generator = myRandom.normal(mu, sigma);
    }

    public calculate(index?: number) {
        // TODO: Use index here
        const isDiscrete = this.getInterface("Discrete").value;
        this.getInterface("Output").value = isDiscrete ? Math.round(this.generator()) : this.generator();
    }

}
