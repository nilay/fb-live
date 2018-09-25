var localVideo;

function init(){
    Flashphoner.init();
    localVideo = document.getElementById("localVideo");
}

function start() {
    Flashphoner.createSession({urlServer: "wss://34.199.108.19:8443"}).on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, function (session) {
        //session connected, start streaming
        startStreaming(session);
    }).on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, function () {
        setStatus("DISCONNECTED");
    }).on(Flashphoner.constants.SESSION_STATUS.FAILED, function () {
        setStatus("FAILED");
    });
}

function startStreaming(session) {
    session.createStream({
        name: "stream222",
        display: localVideo,
        cacheLocalResources: true,
        receiveVideo: false,
        receiveAudio: false
    }).on(Flashphoner.constants.STREAM_STATUS.PUBLISHING, function (publishStream) {
        setStatus(Flashphoner.constants.STREAM_STATUS.PUBLISHING);
    }).on(Flashphoner.constants.STREAM_STATUS.UNPUBLISHED, function () {
        setStatus(Flashphoner.constants.STREAM_STATUS.UNPUBLISHED);
    }).on(Flashphoner.constants.STREAM_STATUS.FAILED, function () {
        setStatus(Flashphoner.constants.STREAM_STATUS.FAILED);
    }).publish();
}

function setStatus(status) {
    document.getElementById("status").innerHTML = status;
}
