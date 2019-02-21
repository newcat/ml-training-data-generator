import { Node, Options } from "baklavajs";

export default class OutputNode extends Node {

    public type = "OutputNode";
    public name = this.type;

    public constructor() {
        super();
        this.addInputInterface("Input", "number", Options.InputOption);
        this.addOption("Label", Options.TextOption);
    }

    public calculate() {
        const label = this.getOptionValue("Label");
        this.setOptionValue(label, this.getInterface("Input").value);
    }

}