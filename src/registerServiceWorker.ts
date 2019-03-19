if ("serviceWorker" in navigator) {

    if (!navigator.serviceWorker.controller) {
        window.addEventListener("load", async () => {
            try {
                await navigator.serviceWorker.register("/sw.js");
                location.reload();
            } catch (err) {
                console.error("Failed to register service worker");
                console.error(err);
            }
        });
    }

}
