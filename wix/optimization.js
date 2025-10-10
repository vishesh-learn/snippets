import * as wixSiteWindow from '@wix/site-window';

export async function getWarmupData(key, promise) {
    let value = wixSiteWindow.warmupData.get(key);

    if (!value) {
        let rendering_env;

        [value, rendering_env] = await Promise.all([
            promise,
            wixSiteWindow.rendering.env()
        ]);

        if (rendering_env == "backend") {
            wixSiteWindow.warmupData.set(key, value);
        }
    }

    return value;
}