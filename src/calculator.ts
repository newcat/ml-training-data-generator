import { Editor, BaklavaEvent } from "@baklavajs/core";
import Worker from "worker-loader!./calculationWorker";
import { ICalculationWorkerMessage } from './types';

export interface IResult {
    data: string;
}

export interface IProgressEventData {
    current: number;
    total: number;
}

export class Calculator {

    public results: Array<Record<string, any>> = [];

    private editor: Editor;
    private workers: Worker[] = [];

    private jobsDone = 0;
    private totalJobs = 0;

    public events = {
        progress: new BaklavaEvent<IProgressEventData>(),
        finished: new BaklavaEvent<void>()
    };

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

    public run(batchSize: number) {

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

        this.results = [];
        this.jobsDone = 0;
        const state = JSON.stringify(this.editor.save());
        for (let i = 0; i < this.workers.length; i++) {
            const w = this.workers[i];
            w.postMessage({
                editorState: state,
                startIndex: jobs[i].start,
                endIndex: jobs[i].end
            } as ICalculationWorkerMessage);
        }

    }

    public reset() {
        this.results = [];
    }

    private handleWorkerMessage(worker: Worker, msg: MessageEvent) {
        this.onData(msg.data);
    }

    private onData(data: Array<Record<string, any>>) {
        if (data.length === 0) { return; }
        data.forEach((d) => this.results.push(d));
        this.jobsDone += data.length;
        this.events.progress.emit({ current: this.jobsDone, total: this.totalJobs });
        if (this.jobsDone >= this.totalJobs) {
            this.events.finished.emit();
        }
    }

}
