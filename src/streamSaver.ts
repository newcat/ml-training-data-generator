let counter = 0;

export default class StreamSaver {

    private textEncoder = new TextEncoder();
    private id = counter++;
    private swc: ServiceWorker|null = null;

    public async initialize(filename: string) {

        this.swc = navigator.serviceWorker.controller;
        if (!this.swc) {
            throw new Error("Could not find service worker");
        }

        let pres: () => void;
        const promise = new Promise((res) => pres = res);

        navigator.serviceWorker.addEventListener("message", (msg) => {
            if (msg.data.id === this.id && msg.data.type === "initialized") {
                pres();
            }
        });
        this.swc.postMessage({ type: "init", filename, id: this.id });

        return promise;

    }

    public write(data: string) {
        if (!this.swc) {
            console.error("You need to call 'initialize' first");
            return;
        }
        const b = this.textEncoder.encode(data);
        this.swc.postMessage({ id: this.id, type: "data", data: b });
    }

    public async close() {
        if (this.swc) {
            this.swc.postMessage({ id: this.id, type: "end" });
            this.swc = null;
        }
    }

}
