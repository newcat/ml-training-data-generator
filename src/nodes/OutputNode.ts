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
        const value = this.getInterface("Input").value;
        (this.state as Record<string, any>).result = value;
    }

}
