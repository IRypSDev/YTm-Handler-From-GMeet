
export async function sendMessagesInExtension( type, message ) {
    return await chrome.runtime.sendMessage({ type, message });
}