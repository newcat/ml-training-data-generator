import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;
    private generator: any = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addInputInterface("Seed", "string", Options.InputOption, "");
        this.addInputInterface("Min", "number", Options.NumberOption, 0);
        this.addInputInterface("Max", "number", Options.NumberOption, 10);
        this.addInputInterface("Discrete", "boolean", Options.CheckboxOption, true);
    }

    public prepare() {
        // read option values
        const seed = this.getInterface("Seed").value;
        const min = this.getInterface("Min").value;
        const max = this.getInterface("Max").value;
        const isDiscrete = this.getInterface("Discrete").value;

        // create new independent random number generator
        const myRandom = random.clone();
        myRandom.use(seedrandom(seed));

        // create configured generator with uniform distribution
        if (isDiscrete) {
            this.generator = myRandom.uniformInt(Math.floor(min), Math.floor(max));
        } else {
            this.generator = myRandom.uniform(min, max);
        }
    }

    public calculate() {
        this.getInterface("Output").value = this.generator();
    }

}
