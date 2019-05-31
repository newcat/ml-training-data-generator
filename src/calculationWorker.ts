import { Engine } from "@baklavajs/plugin-engine";
import createEditor from "./createEditor";
import { ICalculationWorkerMessage } from "./types";
import { runBatch } from "./calculation";

const ctx: Worker = self as any;

const editor = createEditor();
const engine = new Engine(false);
editor.use(engine);

ctx.addEventListener("message", async (msg) => {
    const d = msg.data as ICalculationWorkerMessage;
    editor.load(JSON.parse(d.editorState));
    try {
        await runBatch(d.startIndex, d.endIndex, editor, engine, sendData);
    } catch (error) {
        ctx.postMessage({
            type: "error",
            error: error.message || error
        });
    }
});

function sendData(data: Array<Record<string, any>>) {
    ctx.postMessage({
        type: "data",
        data
    });
}
