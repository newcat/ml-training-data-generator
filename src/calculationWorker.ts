import { Editor, Node } from "@baklavajs/core";
import { Engine } from "@baklavajs/plugin-engine";
import createEditor from "./createEditor";
import { ICalculationWorkerMessage } from "./types";

const ctx: Worker = self as any;

interface IPreparableNode extends Node {
    prepare?(): void;
}

const editor = createEditor();
const engine = new Engine(false);
editor.use(engine);

ctx.addEventListener("message", async (msg) => {
    const d = msg.data as ICalculationWorkerMessage;
    editor.load(JSON.parse(d.editorState));
    runBatch(d, editor);
});

function sendData(data: Array<Record<string, any>>) {
    ctx.postMessage(data);
}

async function runBatch(data: ICalculationWorkerMessage, e: Editor) {

    // prepare every node
    e.nodes.forEach((n: IPreparableNode) => {
        if (n.prepare) {
            n.prepare();
        }
    });

    const outputNodes = e.nodes
        .filter((n) => n.type === "OutputNode")
        .map((n) => [ n.getOptionValue("Label"), n ]) as Array<[string, Node]>;

    let results = [];
    for (let i = data.startIndex; i <= data.endIndex; i++) {

        // inject current index into every IndexValueNode
        e.nodes.forEach((n) => { n.state.index = i; });

        // calculate all nodes
        await engine.calculate();

        const result: Record<string, any> = {};
        outputNodes.forEach(([label, node]) => {
            result[label] = node.state.result;
        });
        results.push(result);

        if (results.length >= 1000) {
            sendData(results);
            results = [];
        }

    }

    if (results.length > 0) {
        sendData(results);
    }

}
