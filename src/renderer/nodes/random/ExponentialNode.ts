import { Node, Options } from "baklavajs";
// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";

export default class ExponentialNode extends Node {

    public type = "ExponentialNode";
    public name = this.type;

    private initialized: boolean = false;
    private generator: any = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed", Options.InputOption);
        this.addOption("Lambda", Options.NumberOption, 10);
        this.addOption("Discrete", Options.CheckboxOption, true);
    }

    private prepare() {
        // read option values
        const seed = this.getOptionValue("Seed");
        const lambda = this.getOptionValue("Lambda");

        // create new independent random number generator
        const myRandom = random.clone();
        myRandom.use(seedrandom(seed));
        this.generator = myRandom.exponential(lambda);

        this.initialized = true;
    }

    public calculate() {
        if (!this.initialized) {
            this.prepare();
        }
        const isDiscrete = this.getOptionValue("Discrete");
        this.getInterface("Output").value = isDiscrete ? Math.round(this.generator()) : this.generator();
    }

}
