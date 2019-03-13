import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";
import { IPreparationData } from "@/types";

export default class ExponentialNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;

    private generator: any = null;
    private seed = "";
    private randomInstance: any = null;
    private lambda = 0;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Lambda", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
    }

    public prepare(data: IPreparationData) {
        // read option values
        this.seed = this.getInterface("Seed").value;
        this.lambda = this.getInterface("Lambda").value;

        // create new independent random number generator
        this.randomInstance = random.clone();
        this.randomInstance.use(this.seed ? seedrandom(this.seed + data.seed) : seedrandom());
        this.generator = this.randomInstance.exponential(this.lambda);
    }

    public calculate(index?: number) {
        if (this.seed) {
            this.randomInstance.use(seedrandom(this.seed + index));
            this.generator = this.randomInstance.exponential(this.lambda);
        }

        const isDiscrete = this.getInterface("Discrete").value;
        this.getInterface("Output").value = isDiscrete ? Math.round(this.generator()) : this.generator();
    }

}
