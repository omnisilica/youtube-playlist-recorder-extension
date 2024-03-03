
//Use Chrome's WebExtension APIs to listen for when a new tab is opened or when a tab is updated.
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log("Tab has been updated.");


    let recordingOn = false;
    const currentVideoMessage = "current_video";

    const playlistRecordings = {};

    let plid = "123";
    let pliddata = {currentVideo:"456"}
    playlistRecordings.plid = pliddata

    //console.log(`Example: ${playlistRecordings.plid.currentVideo}`);
    
    const getCurrentList = async (playlistID) => {
        //console.log(`Result from async function: ${playlistID}`);
        let result = await chrome.storage.local.get([playlistID]);

        return result;
        
        /*let currentList;
        console.log(`playlist id from getCurrentList: ${playlistID}`);

        if(playlistID) {
            currentList = chrome.storage.local.get([playlistID]).then((result) => {

        });
        }

        console.log(currentList);
        
        return currentList;*/
    }
    
    function turnRecordingOn(turnOn){
        
        if(turnOn){
            recordingOn = true;
        }

        return recordingOn;
    }

    function deletPlaylist(playlistID) {
        chrome.storage.local.remove(playlistID);
    }

    function updatePlaylist(playlistToUpdate){
        let playlist = JSON.parse(playlistToUpdate);
        let processedPlaylistVideos = Array.from(new Set(playlist.videos));
        playlist.videos = processedPlaylistVideos;
        const playlistToUpdateID = playlist.playlistID;

        console.log(processedPlaylistVideos);
        console.log(`Passed playlist: ${playlist.currentVideo}`);

        chrome.storage.local.set({[playlistToUpdateID]: playlist}).then(() => {
            console.log("Updated playlist");
            console.log(playlist.videos);
            //console.log(JSON.parse(playlistToAddStringified));
        });

        //deletPlaylist(playlist.playlistID);
    }

    function addVideoToPlaylist(video){
        //get video and playlist parameter from view and if recording is on,
        //search if the playlist exists in storag. If it does exist and it
        //has the same tabid as the tabid from the video obtained from the
        //view, add it to the playlist that it's a part of.


        const videoPlaylistID = video.playlistID;
        var playlistToUpdate;
        var playlistVideos;
        var playlistToSend;

        chrome.storage.local.get(null).then((result) => {
            console.log(result);
            console.log(`Playlist ID: ${videoPlaylistID}`);
            let associatedPlaylist = result[videoPlaylistID];
            let associatedPlaylistVideos = associatedPlaylist.videos;
            let videoToAdd = video.currentVideo;
            console.log(`Associated playlist videos: ${associatedPlaylist}`);
            if(associatedPlaylist && !(associatedPlaylistVideos.videoToAdd)) {
                playlistToUpdate = result[videoPlaylistID];
                playlistVideos = playlistToUpdate.videos;
                console.log(`Current Video To Be Added: ${video.currentVideo}`)
                playlistVideos.push(video.currentVideo);
                console.log(`Playlist as it stands: ${playlistVideos}`);
                playlistToUpdate.videos = playlistVideos;
                playlistToSend = JSON.stringify(playlistToUpdate);
                console.log(`New playslist: ${playlistToUpdate}`);
                updatePlaylist(playlistToSend);
            }
        })

        //console.log(`New playslist: ${playlistToSend}`);
        
        /*chrome.storage.local.get([videoPlaylistID]).then((result) => {

            console.log(`Playlist exists: ${result}`);
        });*/

        /*if(playlistRecordings.videoPlaylistID) {
            console.log(`Exists`);
        }*/
    }

    function addPlaylist(playlist) {
        let playlistInStorage = false;
        
        const playlistToAddID = playlist.playlistID;
        console.log(playlistToAddID);
        console.log(`Add playlist current video: ${playlist.currentVideo}`);

        chrome.storage.local.get(null).then((result) => {
            console.log(result);
            
            if(result.playlistToAddID) {
                playlistInStorage = true;
            }
            
            console.log(`Value from storage: ${playlistInStorage}, ${playlistToAddID}`)
        })

        if(!playlistInStorage) {
            let playlistToAdd = {};
            delete playlist.messageType;

            playlist.videos.push(playlist.currentVideo);

            //playlistToAdd[playlistToAddID] = playlist;

            //playlistToAddStringified = JSON.stringify(playlistToAdd);

            
            
            chrome.storage.local.set({[playlistToAddID]: playlist}).then(() => {
                console.log("Added playlist");
                //console.log(JSON.parse(playlistToAddStringified));
            });
            
            //console.log(`Playlist ID: ${playlistRecordings.playlistToAddID}`);
        } else {
            console.log("Playlist already stored.");
            
            //addVideoToPlaylist(playlist);
        }

        chrome.storage.local.get([playlistToAddID]).then((result) => {
            let resultStringified = JSON.stringify(result);
            console.log(`Playlist exists: ${resultStringified}`);
        });
        
    }
    
    function handleRequest(request, sender, sendResponse) {
        console.log("YouTube playlists from content script below.");
        //console.log(request.youtubePlaylist);
        let recordingStatus;
        if (request.messageType === "playlistDetails") {
            console.log(`Playlist details current video: ${request.currentVideo}`);
            recordingStatus = turnRecordingOn(true);

            
            addPlaylist(request);
            sendResponse({response: recordingStatus});
            sendResponse({response: "Thank you for your service."});
        } else if(request.messageType === "currentRecordingStatus") {
            recordingStatus = turnRecordingOn(false);
            sendResponse({response: recordingStatus});
        } else if(request.messageType === "get_current_list"){
            //console.log("trying to add playlist");
            sendResponse({response: getCurrentList(request.playlist)});
        }/*else if(request.messageType === "video_to_add_details") {
            //console.log(request.currentVideo);
            addVideoToPlaylist(request);
            sendResponse({response: "Thank you for your service."});
        }*/
        
        
    }

    function handleError(error) {
        console.log(error);
    }

    function handlePlaylistToRecord(message) {
        console.log(message);
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, ([tab]) => {
        console.log(`Current Tab URL=> ${tab.url}`);
        let video = {};
        let tabParameters = tab.url.split("?")[1];
        let ytURLParameters = new URLSearchParams(tabParameters);
        video["currentVideo"] = ytURLParameters.get("v");
        video["playlistID"] = ytURLParameters.get("list");
        console.log(`Current Video Details - ${video.currentVideo}`);
        console.log(`Current Video Details - ${video.playlistID}`);

        if(video.playlistID){
            addVideoToPlaylist(video);
        }
    });

    chrome.runtime.onMessage.addListener(handleRequest);

   

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