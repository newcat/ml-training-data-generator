import { Node } from "@baklavajs/core";

export default class OutputNode extends Node {

    public type = "OutputNode";
    public name = this.type;

    public constructor() {
        super();
        this.addInputInterface("Input", "any");
        this.addOption("Label", "InputOption");
        this.addOption("Value", "TextOption");
    }

    public calculate() {
        const value = this.getInterface("Input").value;
        this.state.result = value;
    }

}
