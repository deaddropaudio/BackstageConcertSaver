chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Check if the new URL matches your desired pattern
    if (tab.url && tab.url.startsWith("https://backstage.eu/")) {
        // Enable the extension (full-color icon)
        chrome.action.setIcon({
            path: {
                "48": "icons/icon_48.png",
                "128": "icons/icon_128.png"
            },
            tabId: tabId
        });
        chrome.action.setPopup({
            tabId: tabId,
            popup: 'popup.html'
        });
    } else {
        // Disable the extension (greyed-out icon)
        chrome.action.setIcon({
            path: {
                
                "48": "icons/icon_48_bw.png",
                "128": "icons/icon_128_bw.png"
            },
            tabId: tabId
        });
        chrome.action.setPopup({
            tabId: tabId,
            popup: ''
        });
    }
});