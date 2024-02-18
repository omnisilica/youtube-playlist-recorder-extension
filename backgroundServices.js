
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      console.log(urlParameters.get("Tab has been updated"));
  
      chrome.tabs.sendMessage(tabId, {
        tabStatus: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });