import { Editor } from "baklavajs";
import Worker from "worker-loader!./calculationWorker";
import { ICalculationWorkerMessage } from './types';
import StreamSaver from "./streamSaver";

export class Calculator {

    private editor: Editor;
    private workers: Worker[] = [];

    private stream: StreamSaver|null = null;
    private wroteCsvHeaders = false;
    private promiseResolver: (() => void)|null = null;
    private jobsDone = 0;
    private totalJobs = 0;

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
                this.workers.push(new Worker());
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
        this.stream = new StreamSaver();
        await this.stream.initialize("data.csv");

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

        this.wroteCsvHeaders = false;
        this.jobsDone = 0;
        for (let i = 0; i < this.workers.length; i++) {
            const w = this.workers[i];
            w.postMessage({
                editorState: JSON.stringify(this.editor.save()),
                startIndex: jobs[i].start,
                endIndex: jobs[i].end
            } as ICalculationWorkerMessage);
        }

        return new Promise((res) => {
            this.promiseResolver = res;
        });

    }

    private async handleWorkerMessage(worker: Worker, msg: MessageEvent) {
        const d = msg.data;
        console.log(d);

        if (d.type === "data") {
            await this.onData(d.data);
        }
    }

    private async onData(data: Array<Record<string, any>>) {
        if (!this.stream) {
            throw new Error("Stream not opened");
        }

        if (!this.wroteCsvHeaders) {
            await this.stream.write(Object.keys(data[0]).join(","));
            this.wroteCsvHeaders = true;
        }

        for (const r of data) {
            await this.stream.write(Object.values(r).join(","));
        }

        this.jobsDone += data.length;
        if (this.jobsDone >= this.totalJobs) {
            await this.finalize();
        }

    }

    private async finalize() {
        if (this.stream) {
            await this.stream.close();
        }
        if (this.promiseResolver) {
            this.promiseResolver();
            this.promiseResolver = null;
        }
    }

}
