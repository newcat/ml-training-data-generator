const requests = new Map<string, [ReadableStream, any]>();

self.addEventListener("activate", () => {
    console.log("SW activated");
});

self.addEventListener("message", (event: any) => {

    // We send a heartbeat every x secound to keep the
    // service worker alive
    if (event.data === 'ping') {
        return;
    }

    // Create a unique link that can be used to do fetch on it
    console.log(event);
    console.log(self);
    const url = (self as any).registration.scope + 'intercept-me-nr' + Math.random();
    const port = event.ports[0];

    const stream = event.data.readableStream || createStream(port);
    requests.set(url, [stream, event.data]);
    port.postMessage({ download: url, ping: (self as any).registration.scope + 'ping' });

});

self.addEventListener("fetch", (event: any) => {

    const url = event.request.url;

    if (url.endsWith('/ping')) {
        return event.respondWith(new Response('pong', {
            headers: { 'Access-Control-Allow-Origin': '*' }
        }));
    }

    const request = requests.get(url);
    if (!request) {
        return null;
    }
    const [stream, data] = request;
    requests.delete(url);

    // Make filename RFC5987 compatible
    const filename = encodeURIComponent(typeof data === 'string' ? data : data.filename)
        .replace(/['()]/g, escape)
        .replace(/\*/g, "%2A");

    const headers: Record<string, string> = {
        'Content-Type': 'application/octet-stream; charset=utf-8',
        'Content-Disposition': "attachment; filename*=UTF-8''" + filename
    };

    if (data.size) {
        headers['Content-Length'] = data.size;
    }

    event.respondWith(new Response(stream, { headers }));

});

function createStream(port: MessagePort) {
    // ReadableStream is only supported by chrome 52
    return new ReadableStream({
        start(controller) {
            // When we receive data on the messageChannel, we write
            port.onmessage = ({ data }) => {
                if (data === 'end') {
                    return controller.close();
                }

                if (data === 'abort') {
                    controller.error('Aborted the download');
                    return;
                }

                controller.enqueue(data);
            };
        },
        cancel() {
            console.log('user aborted');
        }
    });
}
