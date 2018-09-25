var remoteVideo;

function init(){
    Flashphoner.init();
    remoteVideo = document.getElementById("remoteVideo");
}

function start() {
    Flashphoner.createSession({urlServer: "wss://wcs5-eu.flashphoner.com:8443"}).on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, function (session) {
        //session connected, start streaming
        startPlayback(session);
    }).on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, function () {
        setStatus("DISCONNECTED");
    }).on(Flashphoner.constants.SESSION_STATUS.FAILED, function () {
        setStatus("FAILED");
    });
}

function startPlayback(session) {
    session.createStream({
        name: "stream222",
        display: remoteVideo,
        cacheLocalResources: true,
        receiveVideo: true,
        receiveAudio: true
    }).on(Flashphoner.constants.STREAM_STATUS.PLAYING, function (playStream) {
        setStatus(Flashphoner.constants.STREAM_STATUS.PLAYING);
    }).on(Flashphoner.constants.STREAM_STATUS.STOPPED, function () {
        setStatus(Flashphoner.constants.STREAM_STATUS.STOPPED);
    }).on(Flashphoner.constants.STREAM_STATUS.FAILED, function () {
        setStatus(Flashphoner.constants.STREAM_STATUS.FAILED);
    }).play();
}

function setStatus(status) {
    document.getElementById("status").innerHTML = status;
}