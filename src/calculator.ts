import { Editor } from "baklavajs";
import Worker from "worker-loader!./calculationWorker";
import { ICalculationWorkerMessage } from './types';

const worker = new Worker();

export class Calculator {

    editor: Editor;

    public constructor(editor: Editor) {
        this.editor = editor;
    }

    public async runBatch(batchSize: number) {
        return new Promise((res, rej) => {
            worker.onmessage = (msg) => {
                worker.onmessage = null;
                res(msg.data);
            };
            worker.postMessage({
                editorState: JSON.stringify(this.editor.save()),
                seed: "",
                batchSize
            } as ICalculationWorkerMessage);
        });
    }

}
