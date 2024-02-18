
/*
- Check whether user is in a youtube page
- Check whether there's a playlist in the current page
- Display the playlist on the current page
- Present button to allow user to start recording the playlist
- Everytime a new video loads that video will be added to the queue of videos that's being created, as long as the user is in a youtube page that's playing the same playlist they started recording
*/

import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    console.log("DOM has loaded");
    
    const currentTab = await getActiveTabURL();
    //const currentVideo = urlParameters.get("v");

    if(currentTab.url.includes("youtube.com/watch")) {
        console.log("User is on a page that's displaying a YouTube Video");
        //console.log(document.getElementsByTagName("ytd-playlist-panel-renderer"));
        //const ytp = document.querySelector("#playlist");
        //console.log(ytp);
        //console.log(document.getElementById("playlist"));
    } else {
        console.log("User is not on a page that's displaying a YouTube Playlist");
        const body = document.getElementsByTagName("body")[0];
        body.innerHTML = "<p>It looks like you're not on a YouTube page with a playlist playing.</p>";
    }
    
});

const render = () => {

}
