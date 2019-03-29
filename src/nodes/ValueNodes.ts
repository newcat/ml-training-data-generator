import { Node, NodeBuilder } from "@baklavajs/core";

const calc = (n: Node) => {
    n.getInterface("Output").value = n.getOptionValue("Value");
};

export const BooleanValueNode = new NodeBuilder("BooleanValueNode")
    .addOption("Value", "CheckboxOption", false)
    .addOutputInterface("Output", { type: "boolean" })
    .onCalculate(calc)
    .build();

export const NumberValueNode = new NodeBuilder("NumberValueNode")
    .addOption("Value", "NumberOption", 0)
    .addOutputInterface("Output", { type: "number" })
    .onCalculate(calc)
    .build();

export const StringValueNode = new NodeBuilder("StringValueNode")
    .addOption("Value", "InputOption", "")
    .addOutputInterface("Output", { type: "string" })
    .onCalculate(calc)
    .build();

export const IndexValueNode = new NodeBuilder("IndexValueNode")
    .addOutputInterface("Index", { type: "number" })
    .build();
