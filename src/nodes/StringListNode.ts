import { Node } from "@baklavajs/core";

export default class StringListNode extends Node {

    type = "StringListNode";
    name = this.type;

    constructor() {
        super();
        // TODO: Replace with IntegerOption
        this.addInputInterface("Index", "NumberOption", 0, { type: "number" });
        this.addOption("Strings", "StringListOption", "String 1\nString 2");
        this.addOutputInterface("String", { type: "string" });
    }

    calculate() {
        const arr = (this.getOptionValue("Strings") as string).split("\n");
        const i = Math.floor(this.getInterface("Index").value);
        let value = "";
        if (i >= 0 && i < arr.length) {
            value = arr[i];
        }
        this.getInterface("String").value = value;
    }

}
