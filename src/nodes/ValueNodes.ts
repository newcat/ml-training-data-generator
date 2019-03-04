import { Node, NodeBuilder, Options } from "baklavajs";

const calc = (n: Node) => {
    n.getInterface("Output").value = n.getOptionValue("Value");
};

export const BooleanValueNode = new NodeBuilder("BooleanValueNode")
    .addOption("Value", Options.CheckboxOption, false)
    .addOutputInterface("Output", "boolean")
    .onCalculate(calc)
    .build();

export const NumberValueNode = new NodeBuilder("NumberValueNode")
    .addOption("Value", Options.NumberOption, 0)
    .addOutputInterface("Output", "number")
    .onCalculate(calc)
    .build();

export const StringValueNode = new NodeBuilder("StringValueNode")
    .addOption("Value", Options.InputOption, "")
    .addOutputInterface("Output", "string")
    .onCalculate(calc)
    .build();

export const IndexValueNode = new NodeBuilder("IndexValue")
    .addOutputInterface("Index", "number")
    .build();
