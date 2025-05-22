export function wixImageToDirectUrl(wixUrl) {
    const match = wixUrl.match(/^wix:image:\/\/v1\/([^/]+)\//);
    if (!match) return null;

    const mediaId = match[1];
    return `https://static.wixstatic.com/media/${mediaId}`;
}