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
        const label = this.getOptionValue("Label");
        const value = this.getInterface("Input").value;
        this.setOptionValue("Value", String(value));
        console.log("Calculated Output:" + String(value));
    }

}
