import { Node, Options } from "baklavajs";

const operations = [
    "Add", "Subtract", "Multiply", "Divide", "Sine", "Cosine", "Tangent", "Arcsine", "Arccosine",
    "Arctangent", "Power", "Logarithm", "Minimum", "Maximum", "Round", "Modulo", "Absolute"
];

export default class MathNode extends Node {

    type = "MathNode";
    name = this.type;

    constructor() {
        super();
        this.addInputInterface("Value 1", "number", Options.NumberOption);
        this.addInputInterface("Value 2", "number", Options.NumberOption);
        this.addOption("Operation", Options.SelectOption, {
            selected: "Add",
            items: operations
        });
        this.addOutputInterface("Result", "number");
    }

    calculate() {

        const val1 = this.getInterface("Value 1").value;
        const val2 = this.getInterface("Value 2").value;
        const operation = this.getOptionValue("Operation").selected;

        let outputVal = 0;
        switch (operation) {
            case "Add":
                outputVal = val1 + val2;
                break;
            case "Subtract":
                outputVal = val1 - val2;
                break;
            case "Multiply":
                outputVal = val1 * val2;
                break;
            case "Divide":
                outputVal = val2 !== 0 ? val1 / val2 : 0;
                break;
            case "Sine":
                outputVal = Math.sin(val1);
                break;
            case "Cosine":
                outputVal = Math.cos(val1);
                break;
            case "Tangent":
                outputVal = Math.tan(val1);
                break;
            case "Arcsine":
                outputVal = Math.asin(val1);
                break;
            case "Arccosine":
                outputVal = Math.acos(val1);
                break;
            case "Arctangent":
                outputVal = Math.atan(val1);
                break;
            case "Power":
                outputVal = Math.pow(val1, val2);
                break;
            case "Logarithm":
                outputVal = Math.log(val1) / Math.log(val2);
                break;
            case "Minimum":
                outputVal = Math.min(val1, val2);
                break;
            case "Maximum":
                outputVal = Math.max(val1, val2);
                break;
            case "Round":
                outputVal = Math.round(val1);
                break;
            case "Modulo":
                outputVal = val1 % val2;
                break;
            case "Absolute":
                outputVal = Math.abs(val1);
                break;
        }

        this.getInterface("Result").value = outputVal;

    }

}
