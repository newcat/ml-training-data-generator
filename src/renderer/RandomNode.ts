import { Node, Options } from "baklavajs";
import random from "random";

export default class RandomNode extends Node {

    public type = "RandomNode";
    public name = this.type;

    constructor() {
        super();
        this.addInputInterface("Input", "boolean", Options.InputOption);
        this.addOutputInterface("Output", "boolean");
        this.addOption("test", Options.InputOption);
        this.addOption("Select", Options.SelectOption, { selected: "Uniform", items: ["Uniform", "Normal", "Exponential"] });
        this.addOption("This is a checkbox", Options.CheckboxOption, true);
        this.addOption("Number", Options.NumberOption);
    }

    public calculate() {
        this.getInterface("Output").value = this.getInterface("Input");
    }

}