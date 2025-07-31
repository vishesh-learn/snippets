export function wixImageToDirectUrl(wixUrl) {
    const match = wixUrl.match(/^wix:image:\/\/v1\/([^/]+)\//);
    if (!match) return null;

    const mediaId = match[1];
    return `https://static.wixstatic.com/media/${mediaId}`;
}

/**
 * Converts a Wix Video URI (wix:video://v1/...) into a direct .mp4 file URL.
 *
 * Example input:
 * "wix:video://v1/9c9398_980d9babfe0c4f5e8873a33b51c92417/5532774-uhd_4096_2160_25fps.mp4#posterUri=..."
 * Output:
 * "https://video.wixstatic.com/video/9c9398_980d9babfe0c4f5e8873a33b51c92417/480p/mp4/file.mp4"
 *
 * @param {string} wixVideoUri
 * @returns {string|null}
 */
export function getWixStaticMp4Url(wixVideoUri) {
    if (typeof wixVideoUri !== 'string' || !wixVideoUri.startsWith('wix:video://v1/')) {
        console.warn("Invalid Wix Video URI format.");
        return null;
    }

    try {
        const cleanPart = wixVideoUri.split('wix:video://v1/')[1];
        const videoId = cleanPart.split('/')[0];

        if (!videoId || videoId.length < 10) {
            console.warn("Could not extract video ID from URI.");
            return null;
        }

        return `https://video.wixstatic.com/video/${videoId}/480p/mp4/file.mp4`;
    } catch (error) {
        console.error("Failed to convert Wix Video URI:", error);
        return null;
    }
}