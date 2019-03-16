import { Editor, NodeConstructor } from "baklavajs";

import UniformNode from "./nodes/random/UniformNode";
import NormalNode from "./nodes/random/NormalNode";
import ExponentialNode from "./nodes/random/ExponentialNode";
import PercentageNode from "./nodes/random/PercentageNode";
import CustomNode from "./nodes/random/CustomNode";
import BooleanNode from "./nodes/BooleanNode";
import MathNode from "./nodes/MathNode";
import OutputNode from "./nodes/OutputNode";
import StringListNode from './nodes/StringListNode';
import FunctionNode from "./nodes/function/FunctionNode";
import * as ValueNodes from "./nodes/ValueNodes";

export default function createEditor(): Editor {

    const editor = new Editor();

    Object.keys(ValueNodes).forEach((x) => {
        editor.registerNodeType(x, (ValueNodes as Record<string, NodeConstructor>)[x], "Value");
    });
    editor.registerNodeType("UniformNode", UniformNode, "Random");
    editor.registerNodeType("NormalNode", NormalNode, "Random");
    editor.registerNodeType("ExponentialNode", ExponentialNode, "Random");
    editor.registerNodeType("CustomNode", CustomNode, "Random");
    editor.registerNodeType("PercentageNode", PercentageNode, "Random");
    editor.registerNodeType("FunctionNode", FunctionNode);
    editor.registerNodeType("BooleanNode", BooleanNode);
    editor.registerNodeType("MathNode", MathNode);
    editor.registerNodeType("StringListNode", StringListNode);
    editor.registerNodeType("OutputNode", OutputNode);
    editor.nodeInterfaceTypes
        .addType("number", "cyan")
        .addType("string", "crimson")
        .addType("boolean", "lightgreen")
        .addType("any", "white")
        .addConversion("number", "string", String)
        .addConversion("number", "boolean", (v) => !!v)
        .addConversion("number", "any", (v) => v)
        .addConversion("string", "number", parseFloat)
        .addConversion("string", "any", (v) => v)
        .addConversion("boolean", "number", (v) => v ? 1 : 0)
        .addConversion("boolean", "string", String)
        .addConversion("boolean", "any", (v) => v)
        .addConversion("any", "number", parseFloat)
        .addConversion("any", "string", String)
        .addConversion("any", "boolean", Boolean);

    return editor;

}
