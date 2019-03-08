import { Editor, NodeConstructor } from "baklavajs";

import UniformNode from "./nodes/random/UniformNode";
import NormalNode from "./nodes/random/NormalNode";
import ExponentialNode from "./nodes/random/ExponentialNode";
import OutputNode from "./nodes/OutputNode";
import * as ValueNodes from "./nodes/ValueNodes";

export default function createEditor(): Editor {

    const editor = new Editor();

    Object.keys(ValueNodes).forEach((x) => {
        editor.registerNodeType(x, (ValueNodes as Record<string, NodeConstructor>)[x], "Value");
    });
    editor.registerNodeType("UniformNode", UniformNode, "Random");
    editor.registerNodeType("NormalNode", NormalNode, "Random");
    editor.registerNodeType("ExponentialNode", ExponentialNode, "Random");
    editor.registerNodeType("OutputNode", OutputNode);
    editor.nodeInterfaceTypes
        .addType("number", "cyan")
        .addType("string", "white")
        .addType("boolean", "lightgreen")
        .addConversion("number", "string", String)
        .addConversion("number", "boolean", (v) => !!v)
        .addConversion("string", "number", parseFloat)
        .addConversion("boolean", "number", (v) => v ? 1 : 0)
        .addConversion("boolean", "string", String);

    return editor;

}
