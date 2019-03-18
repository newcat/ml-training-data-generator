// @ts-ignore
import { createWriteStream, supported } from "streamsaver";

export default class StreamSaver {

    private writer: WritableStreamDefaultWriter;
    private textEncoder: TextEncoder;

    constructor() {
        if (!supported) {
            throw new Error("StreamSaving not supported in your browser");
        }
        const ws = createWriteStream();
        this.writer = ws.getWriter();
        this.textEncoder = new TextEncoder();
    }

    public write(data: string) {
        const b = this.textEncoder.encode(data);
        return this.writer.write(b);
    }

    public async close() {
        await this.writer.ready;
        await this.writer.close();
    }

}
