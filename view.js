
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
    
    const currentTab = await getActiveTabURL();
    //const currentVideo = urlParameters.get("v");

    if(currentTab.url.includes("youtube.com/watch")) {
        //console.log("User is on a page that's displaying a YouTube Video");
        //console.log(document.getElementsByTagName("ytd-playlist-panel-renderer"));
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

const render = () => {

}
