import { Node, Options } from "baklavajs";
import random from "random";
import seedrandom from "seedrandom";

export default class UniformNode extends Node {

    public type = "UniformNode";
    public name = this.type;
    private initialized: boolean = false; 
    private generator: any = null;   

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed", Options.InputOption, "seed");
        this.addOption("Min", Options.NumberOption, 0);
        this.addOption("Max", Options.NumberOption, 10);
        this.addOption("Discrete", Options.CheckboxOption, true);
        console.log(this.initialized);
    }

    private prepare() {
        // read option values
        const seed = this.getOptionValue("Seed");
        const min = this.getOptionValue("Min");
        const max = this.getOptionValue("Max");
        const isDiscrete = this.getOptionValue("Discrete");

        // create new independent random number generator
        const myRandom = random.clone();
        myRandom.use(seedrandom(seed));

        // create configured generator with uniform distribution
        if (isDiscrete) {
            this.generator = myRandom.uniformInt(Math.floor(min), Math.floor(max));
        } else {
            this.generator = myRandom.uniform(min, max);
        }

        this.initialized = true;
    }

    public calculate() {
        if (!this.initialized) {
            this.prepare();
        }
        this.getInterface("Output").value = this.generator();
     }
}