// popup.js - Cross-Browser Compatible and Query Parameter Removal

// Use 'browser' for Firefox, fallback to 'chrome' for Chrome
const API = typeof browser !== 'undefined' ? browser : chrome;

document.getElementById('archiveButton').addEventListener('click', function() {
    // 1. Get the current active tab
    API.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length > 0) {
            const currentTab = tabs[0];
            const currentUrl = currentTab.url;

            // --- START MODIFICATION ---

            // Create a URL object to easily parse the components
            let urlObject;
            try {
                urlObject = new URL(currentUrl);
            } catch (e) {
                // Handle cases where the URL is invalid (e.g., chrome://extensions/)
                console.error("Invalid URL, cannot visit:", currentUrl);
                window.close();
                return;
            }

            // Construct the base URL without query parameters or hash
            // This combines the origin (protocol + domain) and the pathname
            const baseUrlWithoutQuery = urlObject.origin + urlObject.pathname;

            // 2. Construct the new archive.is URL
            const archivePrefix = "https://archive.today/";
            // Use the cleaned URL for the redirect
            const newUrl = archivePrefix + baseUrlWithoutQuery;
            
            // --- END MODIFICATION ---

            // 3. Update the current tab's URL to the new archive link
            API.scripting.executeScript({
                target: { tabId: currentTab.id },
                func: (url) => {
                    // This function runs in the context of the current tab
                    window.location.href = url;
                },
                args: [newUrl] // Pass the new cleaned URL as an argument
            }, () => {
                // 4. Close the popup after the script is executed
                window.close();
            });
        }
    });
});
