
//Use Chrome's WebExtension APIs to listen for when a new tab is opened or when a tab is updated.
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log("Tab has been updated.");

    let recordingOn = false;

    const playListRecordings = {};
    
    function turnRecordingOn(turnOn){
        
        if(turnOn){
            recordingOn = true;
        }

        return recordingOn;
    }
    
    function handleDOM(domContent, sender, sendResponse) {
        console.log("YouTube playlists from content script below.");
        //console.log(domContent.youtubePlaylist);
        if (domContent.messageType === "playlistDetails") {
            console.log(domContent);
            sendResponse({response: turnRecordingOn(true)});
            sendResponse({response: "Thank you for your service."});
        } else if(domContent.messageType === "currentRecordingStatus") {
            sendResponse({response: turnRecordingOn(false)});
        }
        
        
    }

    function handlePlaylistToRecord(message) {
        console.log(message);
    }

    chrome.runtime.onMessage.addListener(handleDOM);

    //Check to see if a tab exists in the first place and if that tab existent tab has a youtube video on it.
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParameters = tab.url.split("?")[1]; //Everything after the question mark includes the url get parameters.
        const urlParameters = new URLSearchParams(queryParameters); //This interface has useful methods pertaining to URL Search Parameters.
        const listParameter = urlParameters.get("list");

        //Check to see if there is a list parameter. This means that the tab the user is on has a youtube playlist on it.
        if(listParameter){
            //console.log("User is on a YouTube page with a playlist on it.");
            
            //Send a message to view.js and display the playlist details to user when they click on the extension
            
            
        }
      
    }
  });