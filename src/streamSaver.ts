export default class StreamSaver {

    private textEncoder = new TextEncoder();
    private channel!: MessageChannel;
    private stream!: TransformStream;
    private writer!: WritableStreamDefaultWriter;

    public async initialize(filename: string) {

        const sw = navigator.serviceWorker.controller;
        if (!sw) {
            throw new Error("Could not find service worker");
        }

        this.channel = new MessageChannel();
        this.stream = new TransformStream();
        this.writer = this.stream.writable.getWriter();

        let pr;
        const p = new Promise((res) => { pr = res; });

        sw.postMessage({
            filename,
            channel: this.channel.port2,
            stream: this.stream.readable
        // @ts-ignore
        }, [ this.channel.port2, this.stream.readable ]);

    }

    public write(data: string) {
        const b = this.textEncoder.encode(data);
    }

    public async close() {
        // TODO
    }

}
