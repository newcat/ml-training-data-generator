const ctx: Worker = self as any;

interface IPreparableNode extends Node {
    prepare?(): void;
}

import { Editor, Node } from "baklavajs";
import createEditor from "./createEditor";
import { ICalculationWorkerMessage } from "./types";

const editor = createEditor();

ctx.addEventListener("message", async (msg) => {
    const d = msg.data as ICalculationWorkerMessage;
    editor.load(JSON.parse(d.editorState));
    const r = await runBatch(d.batchSize, editor);
    ctx.postMessage(r);
});

async function runBatch(batchSize: number, e: Editor) {

    // prepare every node
    e.nodes.forEach((n: IPreparableNode) => {
        if (n.prepare) {
            n.prepare();
        }
    });

    const indexValueNodes = e.nodes.filter((n) => n.type === "IndexValue");
    const outputNodes = e.nodes
        .filter((n) => n.type === "OutputNode")
        .map((n) => [ n.getOptionValue("Label"), n ]) as Array<[string, Node]>;

    const results = [];

    for (let i = 0; i < batchSize; i++) {

        // inject current index into every IndexValueNode
        indexValueNodes.forEach((n) => n.getInterface("Index").value = i);

        // calculate all nodes
        await e.calculate();

        const result = outputNodes
            .reduce((p, c) => {
                p[c[0]] = (c[1].state as Record<string, any>).result;
                return p;
            }, {} as Record<string, any>);
        results.push(result);

    }

    return results;

}
