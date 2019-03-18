interface IRequestInformation {
    filename: string;
    stream: ReadableStream;
    controller?: ReadableStreamDefaultController;
}

const requests = new Map<string, IRequestInformation>();
const ctx = self as any;

ctx.addEventListener("activate", () => {
    console.log("SW activated");
    ctx.skipWaiting();
});

ctx.addEventListener("message", (event: MessageEvent) => {

    if (!ctx.registration) {
        console.log("Not in a SW");
        return;
    }

    const id = event.data.id;

    switch (event.data.type) {
        case "init":
            init(id, event.data.filename);
        case "data":
            handleData(id, event.data.data);
        case "end":
            end(id);
    }

});

ctx.addEventListener("fetch", (event: any) => {

    const url = event.request.url;
    const request = requests.get(url);
    if (!request) {
        return null;
    }

    // Make filename RFC5987 compatible
    const filename = encodeURIComponent(request.filename)
        .replace(/['()]/g, escape)
        .replace(/\*/g, "%2A");

    const headers: Record<string, string> = {
        'Content-Type': 'application/octet-stream; charset=utf-8',
        'Content-Disposition': "attachment; filename*=UTF-8''" + filename
    };

    event.respondWith(new Response(request.stream, { headers }));

});

function init(id: string, filename: string) {

    const rs = new ReadableStream({
        start(controller) {
            requests.get(id)!.controller = controller;
            ctx.postMessage({ type: "initialized", id });
        },
        cancel() {
            console.log('user aborted');
            end(id);
        }
    });

    requests.set(id, { filename, stream: rs });

}

function handleData(id: string, data: any) {

    const request = requests.get(id);

    if (!request) {
        console.warn("Could not find request", id);
        return;
    } else if (!request.controller) {
        console.error("No controller for request", id);
    }

    request.controller!.enqueue(data);

}

function end(id: string) {
    requests.delete(id);
}
