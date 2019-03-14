import { Editor } from "baklavajs";
import Worker from "worker-loader!./calculationWorker";
import { ICalculationWorkerMessage } from './types';

export class Calculator {

    private editor: Editor;
    private workers: Worker[] = [];

    public constructor(editor: Editor) {
        this.editor = editor;
    }

    public setWorkerCount(workerCount: number) {
        if (workerCount > this.workers.length) {
            const workersToSpawn = workerCount - this.workers.length;
            console.log(`Spawning ${workersToSpawn} workers`);
            for (let i = 0; i < workersToSpawn; i++) {
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

        const workerCount = this.workers.length;
        if (workerCount <= 0) {
            console.warn("No active workers");
            return;
        }

        let totalJobs = 0;
        const batchSizePerWorker = [];
        for (let i = 0; i < workerCount; i++) {
            batchSizePerWorker.push(0);
        }
        while (totalJobs < batchSize) {
            const remaining = batchSize - totalJobs;
            if (remaining < workerCount) {
                for (let i = 0; i < remaining; i++) {
                    batchSizePerWorker[i]++;
                    totalJobs++;
                }
            } else {
                const jobsToAdd = Math.floor(remaining / workerCount);
                for (let i = 0; i < workerCount; i++) {
                    batchSizePerWorker[i] += jobsToAdd;
                    totalJobs += jobsToAdd;
                }
            }
        }

        let currentIndex = 0;
        const jobs: Array<{ start: number, end: number }> = [];
        for (let i = 0; i < workerCount; i++) {
            jobs.push({ start: currentIndex, end: currentIndex + batchSizePerWorker[i] - 1 });
            currentIndex += batchSizePerWorker[i];
        }

        const workerResults: Array<Promise<any>> = this.workers.map(
            (w, i) => new Promise((res) => {
                w.onmessage = (msg) => {
                    w.onmessage = null;
                    res(msg.data);
                };
                w.postMessage({
                    editorState: JSON.stringify(this.editor.save()),
                    seed: "worker" + i,
                    startIndex: jobs[i].start,
                    endIndex: jobs[i].end
                } as ICalculationWorkerMessage);
            }));

        return Promise.all(workerResults).then((res) => res.flatMap((x) => x));
    }

}
