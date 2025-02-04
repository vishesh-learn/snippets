async function getWarmupData(key, promise) {
    let value = wixWindowFrontend.warmupData.get(key);

    if (!value) {
        value = await promise;

        if (wixWindowFrontend.rendering.env == "backend") {
            wixWindowFrontend.warmupData.set(key, value);
        }
    }

    return value;
}
