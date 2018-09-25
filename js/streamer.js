var localVideo;

function init(){
    Flashphoner.init();
    localVideo = document.getElementById("localVideo");
}

function start(rtmpUrl) {
    Flashphoner.createSession({urlServer: "wss://demo.flashphoner.com:8443"}).on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, function (session) {
        //session connected, start streaming
        startStreaming(session, rtmpUrl);
    }).on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, function () {
        setStatus("DISCONNECTED");
    }).on(Flashphoner.constants.SESSION_STATUS.FAILED, function () {
        setStatus("FAILED");
    });
}

function startStreaming(session, rtmpUrl) {
    var streamName = "stream222"
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
  var url = "https://demo.flashphoner.com:8444/rest-api/push/startup";
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json");

  var data = JSON.stringify({"streamName":streamName,"rtmpUrl":rtmpUrl});
  var response = xhr.send(data);
}

function setStatus(status) {
    document.getElementById("status").innerHTML = status;
}
