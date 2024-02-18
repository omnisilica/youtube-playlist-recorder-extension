
(() => {

    console.log(document.querySelector("#playlist"));
    //console.log("In my content script");
    //Search for a playlist id, make sure it doesn't have a hidden attribute, if that's true then pass the list parameter to background services
    let currentVideo = "";

    const newVideoLoaded = async () => {
        console.log("In my content script");
    }
    chrome.runtime.onMessage.addListener((message, sender, response) => {
        const { tabId, tabStatus, videoId } = message;
    });

    
})();