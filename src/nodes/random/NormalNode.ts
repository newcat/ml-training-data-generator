import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";
import { IPreparationData } from "@/types";

export default class NormalNode extends Node {

    public type = "NormalNode";
    public name = this.type;

    private randomInstance: any = null;
    private generator: any = null;
    private seed = "";
    private sigma = 0;
    private mu = 0;

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
        this.seed = this.getInterface("Seed").value;
        this.mu = this.getInterface("Mu").value;
        this.sigma = this.getInterface("Sigma").value;

        // create new independent random number generator
        this.randomInstance = random.clone();
        this.randomInstance.use(seedrandom());
        this.generator = this.randomInstance.normal(this.mu, this.sigma);
    }

    public calculate(index?: number) {
        if (this.seed) {
            this.randomInstance.use(seedrandom(this.seed + index));
            this.generator = this.randomInstance.normal(this.mu, this.sigma);
        }

        const isDiscrete = this.getInterface("Discrete").value;
        this.getInterface("Output").value = isDiscrete ? Math.round(this.generator()) : this.generator();
    }

}
