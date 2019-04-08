import { Node } from "@baklavajs/core";

const operations = [ "==", ">", "<", ">=", "<=" ];

export default class BooleanNode extends Node {

    type = "BooleanNode";
    name = this.type;

    constructor() {
        super();
        this.addInputInterface("Value 1", "NumberOption", 0, { type: "number" });
        this.addInputInterface("Value 2", "NumberOption", 0, { type: "number" });
        this.addInputInterface("Use Integer Values", "CheckboxOption", false, { type: "boolean" });
        this.addInputInterface("Invert Output", "CheckboxOption", false, { type: "boolean" });
        this.addOption("Operation", "SelectOption", {
            selected: "==",
            items: operations
        });
        this.addOutputInterface("Result", { type: "boolean" });
    }

    calculate() {

        const val1 = this.getInterface("Value 1").value;
        const val2 = this.getInterface("Value 2").value;
        const useInt = this.getInterface("Use Integer Values").value;
        const invert = this.getInterface("Invert Output").value;
        const operation = this.getOptionValue("Operation").selected;

        let result = false;
        switch (operation) {
            case "==":
                result = useInt ? Math.floor(val1) === Math.floor(val2) : val1 === val2;
                break;
            case ">":
                result = useInt ? Math.floor(val1) > Math.floor(val2) : val1 > val2;
                break;
            case "<":
                result = useInt ? Math.floor(val1) < Math.floor(val2) : val1 < val2;
                break;
            case ">=":
                result = useInt ? Math.floor(val1) >= Math.floor(val2) : val1 >= val2;
                break;
            case "<=":
                result = useInt ? Math.floor(val1) <= Math.floor(val2) : val1 <= val2;
                break;
        }

        if (invert) {
            result = !result;
        }

        this.getInterface("Result").value = result;

    }

}
