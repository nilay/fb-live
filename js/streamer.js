var localVideo;

function init(){
    Flashphoner.init();
    localVideo = document.getElementById("localVideo");
}

function createFbVideoStream(userId){
  FB.api('/' + userId + '/live_videos', "POST", function(response) {
    console.log("Rtmp url fetch sucessfull. " + response.stream_url);
    // we have received rtmp url from facebook.
    // lets start streaming
    start(response.stream_url);
  });
}

function fbLogin(){
  FB.login(function(response) {
    if (response.authResponse) {
      console.log("Login sucessfull. Fetch rtmp url from facebook");
      createFbVideoStream(response.authResponse.userID)
    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
  }, {scope: 'publish_video,email'});
}


function start(rtmpUrl) {
    Flashphoner.createSession({urlServer: "wss://34.199.108.19:8443"}).on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, function (session) {
        //session connected, start streaming
        startStreaming(session, rtmpUrl);
    }).on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, function () {
        setStatus("DISCONNECTED");
    }).on(Flashphoner.constants.SESSION_STATUS.FAILED, function () {
        setStatus("FAILED");
    });
}

function startStreaming(session, rtmpUrl) {
    var streamName = "s2236"
    session.createStream({
        name: streamName,
        display: localVideo,
        cacheLocalResources: true,
        receiveVideo: false,
        receiveAudio: false
    }).on(Flashphoner.constants.STREAM_STATUS.PUBLISHING, function (publishStream) {
        setStatus(Flashphoner.constants.STREAM_STATUS.PUBLISHING);
        // re-broadcast on rtmp url
        broadcastToRtmp(publishStream, rtmpUrl, streamName);
    }).on(Flashphoner.constants.STREAM_STATUS.UNPUBLISHED, function () {
        setStatus(Flashphoner.constants.STREAM_STATUS.UNPUBLISHED);
    }).on(Flashphoner.constants.STREAM_STATUS.FAILED, function () {
        setStatus(Flashphoner.constants.STREAM_STATUS.FAILED);
    }).publish();
}

function broadcastToRtmp(publishStream, rtmpUrl, streamName){
  xhr = new XMLHttpRequest();
  var url = "https://34.199.108.19:8888/rest-api/push/startup";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
          console.log(xhr.responseText)
      }
  }

  var data = JSON.stringify({"streamName":streamName,"rtmpUrl":rtmpUrl});
  xhr.send(data);
}

function setStatus(status) {
    document.getElementById("status").innerHTML = status;
}
