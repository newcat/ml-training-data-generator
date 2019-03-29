import { Editor } from "@baklavajs/core";
import Worker from "worker-loader!./calculationWorker";
import { ICalculationWorkerMessage } from './types';

export interface IResult {
    data: string;
}

export class Calculator {

    private editor: Editor;
    private workers: Worker[] = [];

    private wroteCsvHeaders = false;
    private promiseResolver: ((result: IResult) => void)|null = null;
    private jobsDone = 0;
    private totalJobs = 0;
    // use an object for call-by-reference
    private result: IResult = { data: "" };

    public constructor(editor: Editor) {
        this.editor = editor;
    }

    public setWorkerCount(workerCount: number) {
        if (workerCount > this.workers.length) {
            const workersToSpawn = workerCount - this.workers.length;
            console.log(`Spawning ${workersToSpawn} workers`);
            for (let i = 0; i < workersToSpawn; i++) {
                const w = new Worker();
                w.addEventListener("message", (ev) => this.handleWorkerMessage(w, ev));
                this.workers.push(w);
            }
        } else if (workerCount < this.workers.length) {
            const workersToTerminate = this.workers.length - workerCount;
            console.log(`Terminating ${workersToTerminate} workers`);
            for (let i = 0; i < workersToTerminate; i++) {
                this.workers.pop()!.terminate();
            }
        }
    }

    public async runBatch(batchSize: number) {

        const workerCount = this.workers.length;
        if (workerCount <= 0) {
            console.warn("No active workers");
            return;
        }

        this.totalJobs = 0;
        const batchSizePerWorker = [];
        for (let i = 0; i < workerCount; i++) {
            batchSizePerWorker.push(0);
        }
        while (this.totalJobs < batchSize) {
            const remaining = batchSize - this.totalJobs;
            if (remaining < workerCount) {
                for (let i = 0; i < remaining; i++) {
                    batchSizePerWorker[i]++;
                    this.totalJobs++;
                }
            } else {
                const jobsToAdd = Math.floor(remaining / workerCount);
                for (let i = 0; i < workerCount; i++) {
                    batchSizePerWorker[i] += jobsToAdd;
                    this.totalJobs += jobsToAdd;
                }
            }
        }

        let currentIndex = 0;
        const jobs: Array<{ start: number, end: number }> = [];
        for (let i = 0; i < workerCount; i++) {
            jobs.push({ start: currentIndex, end: currentIndex + batchSizePerWorker[i] - 1 });
            currentIndex += batchSizePerWorker[i];
        }

        this.result = { data: "" };
        this.wroteCsvHeaders = false;
        this.jobsDone = 0;
        const state = JSON.stringify(this.editor.save());
        console.log(state);
        for (let i = 0; i < this.workers.length; i++) {
            const w = this.workers[i];
            w.postMessage({
                editorState: state,
                startIndex: jobs[i].start,
                endIndex: jobs[i].end
            } as ICalculationWorkerMessage);
        }

        return new Promise<IResult>((res) => {
            this.promiseResolver = res;
        });

    }

    private async handleWorkerMessage(worker: Worker, msg: MessageEvent) {
        await this.onData(msg.data);
    }

    private async onData(data: Array<Record<string, any>>) {

        if (!this.wroteCsvHeaders) {
            this.result.data = Object.keys(data[0]).join(";") + "\n";
            this.wroteCsvHeaders = true;
        }

        for (const r of data) {
            this.result.data += Object.values(r).join(";") + "\n";
        }

        this.jobsDone += data.length;
        if (this.jobsDone >= this.totalJobs) {
            await this.finalize();
        }

    }

    private async finalize() {
        if (this.promiseResolver) {
            this.promiseResolver(this.result);
            this.promiseResolver = null;
        }
    }

}
