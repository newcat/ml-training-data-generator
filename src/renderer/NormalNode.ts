import { Node, Options } from "baklavajs";
import random from "random";
import seedrandom from "seedrandom";

export default class NormalNode extends Node {

    public type = "NormalNode";
    public name = this.type;

    private initialized: boolean = false;
    private generator: any = null;

    constructor() {
        super();
        this.addOutputInterface("Output", "number");
        this.addOption("Seed", Options.InputOption, "seed");
        this.addOption("Mu", Options.NumberOption, 0);
        this.addOption("Sigma", Options.NumberOption, 10);
        this.addOption("Discrete", Options.CheckboxOption, true);
    }

    private prepare() {
        // read option values
        const seed = this.getOptionValue("Seed");
        const mu = this.getOptionValue("Mu");
        const sigma = this.getOptionValue("Sigma");

        // create new independent random number generator
        const myRandom = random.clone();
        myRandom.use(seedrandom(seed));
        this.generator = myRandom.normal(mu, sigma);

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