import { Node, Options } from "baklavajs";

const operations = [ "==", ">", "<", ">=", "<=" ];

export default class BooleanNode extends Node {

    type = "BooleanNode";
    name = this.type;

    constructor() {
        super();
        this.addInputInterface("Value 1", "number", Options.NumberOption, 0);
        this.addInputInterface("Value 2", "number", Options.NumberOption, 0);
        this.addInputInterface("Use Integer Values", "boolean", Options.CheckboxOption, false);
        this.addInputInterface("Invert Output", "boolean", Options.CheckboxOption, false);
        this.addOption("Operation", Options.SelectOption, {
            selected: "==",
            items: operations
        });
        this.addOutputInterface("Result", "boolean");
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
