import { Node } from "@baklavajs/core";

export default class ConstraintNode extends Node {

    public type = "ConstraintNode";
    public name = this.type;

    constructor() {
        super();
        this.addInputInterface("Is Valid", "CheckboxOption", true, { type: "boolean" });
    }

}
