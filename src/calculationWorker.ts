import { Editor, Node } from "baklavajs";
import createEditor from "./createEditor";
import { ICalculationWorkerMessage, IPreparationData } from "./types";

const ctx: Worker = self as any;

interface IPreparableNode extends Node {
    prepare?(data: IPreparationData): void;
}

const editor = createEditor();

ctx.addEventListener("message", async (msg) => {
    const d = msg.data as ICalculationWorkerMessage;
    editor.load(JSON.parse(d.editorState));
    const r = await runBatch(d, editor);
    ctx.postMessage(r);
});

async function runBatch(data: ICalculationWorkerMessage, e: Editor) {

    // prepare every node
    e.nodes.forEach((n: IPreparableNode) => {
        if (n.prepare) {
            n.prepare({ seed: data.seed });
        }
    });

    const indexValueNodes = e.nodes.filter((n) => n.type === "IndexValueNode");
    const outputNodes = e.nodes
        .filter((n) => n.type === "OutputNode")
        .map((n) => [ n.getOptionValue("Label"), n ]) as Array<[string, Node]>;

    const results = [];

    for (let i = data.startIndex; i <= data.endIndex; i++) {

        // inject current index into every IndexValueNode
        indexValueNodes.forEach((n) => n.getInterface("Index").value = i);

        // calculate all nodes
        for (const n of e.nodeCalculationOrder) {
            await (n as any).calculate(i);
        }

        const result = outputNodes
            .reduce((p, c) => {
                p[c[0]] = (c[1].state as Record<string, any>).result;
                return p;
            }, {} as Record<string, any>);
        results.push(result);

    }

    return results;

}
