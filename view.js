
/*
- Check whether user is in a youtube page
- Check whether there's a playlist in the current page
- Display the playlist on the current page
- Present button to allow user to start recording the playlist
- Everytime a new video loads that video will be added to the queue of videos that's being created, as long as the user is in a youtube page that's playing the same playlist they started recording
*/

import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    //console.log("DOM has loaded");
    const root_ = document.querySelector(".root_");
    const api_key = "AIzaSyA_r7zJsZa4Wv5DAjd552eOPTfU8heneAI";
    
    const currentTab = await getActiveTabURL();
    //const currentVideo = urlParameters.get("v");
    const currentTabParameters = currentTab.url.split("?")[1];
    const ytURLParameters = new URLSearchParams(currentTabParameters);
    const ytListParameter = ytURLParameters.get("list");
    //currentTab.playlistRecording = false;
    const status = {recordingInProgress:false};

    function getRecordingStatus(){
      const request = {
        messageType: "currentRecordingStatus"
      }

      chrome.runtime.sendMessage(request).then(handleUI, handleError);

      
    }

    function recordingInProgressUI() {
      const playlistDetailsSectionDiv = document.querySelector(".record-playlist");
      const viewAllButton = document.createElement("button");
      viewAllButton.innerHTML = "View All";

      const stopRecordingButton = document.createElement("button");
      stopRecordingButton.innerHTML = "Stop Recording";

      playlistDetailsSectionDiv.replaceChildren(viewAllButton, stopRecordingButton);
    }

    function handleUI(message) {
      console.log(`before change: ${status.recordingInProgress}`)
      status.recordingInProgress = message.response;

      if(status.recordingInProgress) {
        recordingInProgressUI();
      }
      
      console.log(`After change: ${status.recordingInProgress}`);
    }
    
    function handleResponse(message){
      //console.log(`Message from the background script: ${message.response}`);
      status.recordingInProgress = message.response;
      console.log(`Recording Status: ${status.recordingInProgress}`);
  }

  function handleError(error){
      console.log(`Error: ${error}`);
  }

    function recordPlaylist(event, playlistToRecord) {
      console.log(currentTab);
      
      //recordingInProgressUI();

      
      chrome.runtime.sendMessage(playlistToRecord).then(handleResponse, handleError);
    }

    

    
    if(currentTab.url.includes("youtube.com/watch") && ytListParameter) {
        console.log("User is on a page with an active playlist.");
        
        const response = await

         //fetch("https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=PLW-N9qZtco2U7hjPBkakwc4fdQ9v095ey&key=AIzaSyA_r7zJsZa4Wv5DAjd552eOPTfU8heneAI");
         fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${ytListParameter}&key=${api_key}`);
         const playlistSnippetResponse = await response.json();
         
         const defaultPlaylistThumbnail = playlistSnippetResponse.items[0].snippet.thumbnails.default.url;
         const playlistTitle = playlistSnippetResponse.items[0].snippet.title;
         
         console.log(`YouTube Default Thumbanil URL: ${defaultPlaylistThumbnail}`);
        
       const tempImg = "https://i.ytimg.com/vi/2zEiiZi2DKk/default.jpg";
       const tempTitle = "Worship";

       const playlistDetailsSection = document.createElement("section");
       const playlistDetailsSectionImg = document.createElement("img");
       const playlistDetailsSectionTitleDiv = document.createElement("div");
       const playlistDetailsSectionTitleParagraph = document.createElement("p");
       let playlistDetailsSectionRecordOptionDiv;
       let playlistDetailsSectionRecordParagraph;
       


       playlistDetailsSection.className = "playlist-details";
       playlistDetailsSectionTitleDiv.className = "playlist-title";
       

       playlistDetailsSectionImg.src = defaultPlaylistThumbnail;
       //playlistDetailsSectionImg.src = tempImg;
       playlistDetailsSectionImg.alt = `Thumbnail image for ${playlistTitle}`;
       playlistDetailsSectionImg.title = `Thumbnail image for ${playlistTitle}`;
       playlistDetailsSectionTitleParagraph.innerHTML = playlistTitle;
      // playlistDetailsSectionTitleParagraph.innerHTML = tempTitle;

      
      
      
        
        playlistDetailsSectionRecordOptionDiv = document.createElement("div");
        playlistDetailsSectionRecordParagraph = document.createElement("p");
       playlistDetailsSectionRecordOptionDiv.className = "record-playlist";
        playlistDetailsSectionRecordParagraph.innerHTML = "Record";
        playlistDetailsSectionRecordOptionDiv.appendChild(playlistDetailsSectionRecordParagraph);
       
        

       playlistDetailsSectionTitleDiv.appendChild(playlistDetailsSectionTitleParagraph);
       

       playlistDetailsSection.appendChild(playlistDetailsSectionImg);
       playlistDetailsSection.appendChild(playlistDetailsSectionTitleDiv);
       playlistDetailsSection.appendChild(playlistDetailsSectionRecordOptionDiv);

       root_.appendChild(playlistDetailsSection);

       const playlistToRecord = {
        messageType: "playlistDetails",
        playlistID: ytListParameter,
        playlistTitle: tempTitle,
        playlistDefaultThumbnail: tempImg,
        tabID: currentTab.id
      }
      
      getRecordingStatus();

       playlistDetailsSectionRecordOptionDiv.addEventListener("click", (event) => {
        //currentTab.playlistRecording = true;
        //console.log(recordingInProgress);
        recordPlaylist(event, playlistToRecord);
       });
        

        /*
          Features:
          - Allow multiple playlist recordings
            1. Add event listener to record button to start recording playlist using playlist id.
               Summary: Basically, add a the mechanism to record and the page to view the recordings so far. Then add the option to take notes and have that note attached to the video that was playing at the time.
            2. Change record button to stop recording button.
              - Add event listener to stop recording this playlist when clicked.
              - Add mechanism to stop listening if tab is closed
            3. Add button next to stop recording button that will allow user to view what the recordings for a particular playlist
          - Add reasons and instructions for why playlist isn't seen
              - If there's a plyalist parameter but it's not being read, notify user and let them know how to make playlist unlisted or public              
          - Allow user to add notes
          - If user copies url of playlist and places it in a different tab then ask the user if they want to continue from where they left off or start fresh.
          - When tab is closed without stop recording button clicked save the recording for a couple days.
            - Create an option for a user to see the past recordings for the past couple days.
          - Display how many videos in video cards*/

    } else if (currentTab.url.includes("youtube.com")) {
        console.log("User is on a YouTube page, but not one with an active playlist on it.");
        const not_a_yt_page_with_active_playlist_div = document.createElement("div");
        not_a_yt_page_with_active_playlist_div.className = "no-active-playlist-container";
        const not_a_yt_page_with_active_playlist_paragraph = document.createElement("p");
        not_a_yt_page_with_active_playlist_paragraph.innerHTML = "It looks like you're not on a YouTube page with an active playlist on it.";
        not_a_yt_page_with_active_playlist_div.appendChild(not_a_yt_page_with_active_playlist_paragraph);
        root_.replaceChildren(not_a_yt_page_with_active_playlist_div);
    } else {
        console.log("User is not on a page that's displaying a YouTube Playlist");
        console.log(root_);
        const not_a_yt_page_div = document.createElement("div");
        not_a_yt_page_div.className = "not-yt-page";
        not_a_yt_page_div.innerHTML = "<p>It looks like you're not on a YouTube page.<p/>"
        
        const ytLinkAnchor = document.createElement("a");
        const ytAnchorText = document.createTextNode("Go to YouTube");
        ytLinkAnchor.href = "https://www.youtube.com/";
        ytLinkAnchor.appendChild(ytAnchorText);
        ytLinkAnchor.title = "Click to navigate to YouTube.";
        ytLinkAnchor.target = "_blank";
        
        not_a_yt_page_div.appendChild(ytLinkAnchor);
        root_.appendChild(not_a_yt_page_div);

        console.log(root_);
    }
    
});

const render = (html, replacePresentHTML) => {

}


/*
{
  "kind": "youtube#playlistListResponse",
  "etag": "r-KwPlRZtREWfqjYrXtEdmE86u8",
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 5
  },
  "items": [
    {
      "kind": "youtube#playlist",
      "etag": "PnPSeI3PXe5vPs-cRFKb0iR5MTU",
      "id": "PLW-N9qZtco2U7hjPBkakwc4fdQ9v095ey",
      "snippet": {
        "publishedAt": "2021-11-06T05:14:04Z",
        "channelId": "UCCc_yHetbPXufagfQ0SSDsw",
        "title": "Worship",
        "description": "",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/2zEiiZi2DKk/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/2zEiiZi2DKk/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/2zEiiZi2DKk/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/2zEiiZi2DKk/sddefault.jpg",
            "width": 640,
            "height": 480
          }
        },
        "channelTitle": "creatingathousandwords",
        "localized": {
          "title": "Worship",
          "description": ""
        }
      }
    }
  ]
}

*/