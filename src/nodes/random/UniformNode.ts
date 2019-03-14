import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";
import { IPreparationData } from "@/types";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;

    private randomInstance: any = null;
    private generator: any = null;
    private seed = "";
    private min = 0;
    private max = 0;
    private isDiscrete = false;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Min", "number", Options.NumberOption, 0);
        this.addInputInterface("Max", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
    }

    public prepare(data: IPreparationData) {
        // read option values
        this.seed = this.getInterface("Seed").value;
        this.min = this.getInterface("Min").value;
        this.max = this.getInterface("Max").value;
        this.isDiscrete = this.getInterface("Discrete").value;

        // create new independent random number generator
        this.randomInstance = random.clone();
        this.randomInstance.use(seedrandom());

        // create configured generator with uniform distribution
        if (this.isDiscrete) {
            this.generator = this.randomInstance.uniformInt(Math.floor(this.min), Math.floor(this.max));
        } else {
            this.generator = this.randomInstance.uniform(this.min, this.max);
        }
    }

    public calculate(index?: number) {
        if (this.seed) {
            this.randomInstance.use(seedrandom(this.seed + index));
            this.generator = this.isDiscrete ?
                this.randomInstance.uniformInt(Math.floor(this.min), Math.floor(this.max)) :
                this.randomInstance.uniform(this.min, this.max);
        }
        this.getInterface("Output").value = this.generator();
    }

}
