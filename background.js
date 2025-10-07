// background.js - Hybrid Logic for Context Menu and Action Icon

// Use 'browser' for Firefox, fallback to 'chrome' for Chrome
const API = typeof browser !== 'undefined' ? browser : chrome;
const ARCHIVE_PREFIX = "https://archive.is/";

// Helper function to remove query parameters
function removeQueryParams(url) {
    let urlObject;
    try {
        urlObject = new URL(url);
    } catch (e) {
        console.error("Invalid URL:", url);
        return url;
    }
    return urlObject.origin + urlObject.pathname;
}

// Handler function to archive and redirect a specific URL
function archiveAndRedirect(tabId, urlToArchive) {
    if (urlToArchive) {
        let cleanedUrl = removeQueryParams(urlToArchive);
        const newUrl = ARCHIVE_PREFIX + cleanedUrl;
        API.tabs.update(tabId, { url: newUrl });
    }
}


// 1. Create Context Menu Items on Installation
API.runtime.onInstalled.addListener(() => {
    API.contextMenus.create({
        id: "archive-redirect-link",
        title: "Visit Link on archive.today",
        contexts: ["link"] // Right-click on a link
    });

    API.contextMenus.create({
        id: "archive-redirect-page",
        title: "Visit Current Page in archive.is",
        contexts: ["page"] // Right-click on the page background
    });
});

// 2. Handle Context Menu Clicks
API.contextMenus.onClicked.addListener((info, tab) => {
    let urlToArchive = null;

    if (info.menuItemId === "archive-redirect-link") {
        // Context Menu Click on a Link
        urlToArchive = info.linkUrl;
    } else if (info.menuItemId === "archive-redirect-page") {
        // Context Menu Click on Page Background
        urlToArchive = info.pageUrl;
    }

    archiveAndRedirect(tab.id, urlToArchive);
});


// 3. Handle Action (Toolbar Icon) Clicks
API.action.onClicked.addListener((tab) => {
    // Action Icon Click always archives the current page URL
    archiveAndRedirect(tab.id, tab.url);
});
