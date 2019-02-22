import { Node, Options } from "baklavajs";

export default class OutputNode extends Node {

    public type = "OutputNode";
    public name = this.type;

    public constructor() {
        super();
        this.addInputInterface("Input", "number");
        this.addOption("Label", Options.InputOption);
        this.addOption("Value", Options.TextOption);
    }

    public calculate() {
        console.log("Calculate Output");
        // const label = this.getOptionValue("Label");
        console.log(this.getInterface("Input").value);
        this.setOptionValue("Value", this.getInterface("Input").value);
    }

}