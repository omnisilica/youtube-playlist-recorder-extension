
(() => {
    /*The content script can send dom objects to the background script.
      But when it reaches the background script the background script only sees
      the object prototype. It doesn't see the object passed as a dom object.
    */


    console.log("Content script active.");

    //Extract the playlist from the YouTube page. Come back to this and figure out why const is the only variable declaration that works for this.
    const youtubePlaylist = document.getElementById("playlist");

    console.log(youtubePlaylist);

    function handleResponse(message){
        console.log(`Message from the background script: ${message.response}`);
    }

    function handleError(error){
        console.log(`Error: ${error}`);
    }
    
    chrome.runtime.sendMessage({youtubePlaylist:"youtubePlaylist"})
    .then(handleResponse, handleError);
    
    })();
    
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //     console.log("Inside Message");

    //     //Destruct the message object that was received from backgroundServices.js
    //     const { tabStatus, videoId, playlistId } = message;

    //     //Check to make sure message from backgroundServices was received
    //     if(tabStatus === "NEW" && youtubePlaylist){
    //         console.log(youtubePlaylist);

    //         sendResponse(youtubePlaylist);

    //         console.log("Content script sent message.");
    //     }

        

        //


        //Check to see if there is a YouTube playlists on the page
    /*if(youtubePlaylist){
        chrome.runtime.sendMessage({youtubePlaylist: youtubePlaylist});
        console.log(youtubePlaylist);
        console.log("Content script sent message.");
    }
    });

    


    
})();
*/