import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";
import { IPreparationData } from "@/types";

export default class ExponentialNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;
    private generator: any = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Lambda", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
    }

    public prepare(data: IPreparationData) {
        // read option values
        const seed = this.getInterface("Seed").value;
        const lambda = this.getInterface("Lambda").value;

        // create new independent random number generator
        const myRandom = random.clone();
        myRandom.use(seed ? seedrandom(seed + data.seed) : seedrandom());
        this.generator = myRandom.exponential(lambda);
    }

    public calculate(index?: number) {
        // TODO: Use index here
        const isDiscrete = this.getInterface("Discrete").value;
        this.getInterface("Output").value = isDiscrete ? Math.round(this.generator()) : this.generator();
    }

}
