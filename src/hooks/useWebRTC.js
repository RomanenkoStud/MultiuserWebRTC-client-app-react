import { useRef, useEffect, useReducer } from "react";
import socketio from "socket.io-client";

const connectionOptions = {
    autoConnect: false,
};
const STUN_SERVERS = {
    iceServers: [
        {
        urls: "stun:relay.metered.ca:80",
        },
        {
        urls: "turn:relay.metered.ca:80",
        username: "225cb4947d2e0039e9e91749",
        credential: "jfC3ZhKAEL0v9nIa",
        },
        {
        urls: "turn:relay.metered.ca:443",
        username: "225cb4947d2e0039e9e91749",
        credential: "jfC3ZhKAEL0v9nIa",
        },
        {
        urls: "turn:relay.metered.ca:443?transport=tcp",
        username: "225cb4947d2e0039e9e91749",
        credential: "jfC3ZhKAEL0v9nIa",
        },
    ],
};

const replaceTracks = (oldStream, newStream, pc, sendOffer) => {
    const oldAudioTrack = oldStream.getAudioTracks()[0];
    const oldVideoTrack = oldStream.getVideoTracks()[0];
    const newAudioTrack = newStream.getAudioTracks()[0];
    const newVideoTrack = newStream.getVideoTracks()[0];
    for (let sid in pc) {
        pc[sid].getSenders().forEach(sender => {
            if (sender.track === oldAudioTrack) {
                sender.replaceTrack(newAudioTrack);
            }
            if (sender.track === oldVideoTrack) {
                sender.replaceTrack(newVideoTrack);
            }
        });
        sendOffer(sid);
    }
    oldAudioTrack.stop();
    oldVideoTrack.stop();
}

const muteAudio = (dataChannel, localStream, audioState) => {
const audioTrack = localStream.getAudioTracks()[0];
audioTrack.enabled = !audioState;

    // Send a message to the remote peer over the data channel
    const message = {
    type: 'mute-track',
    trackType: 'audio',
    muted: audioState
    };
    for (const id in dataChannel) {
    dataChannel[id].send(JSON.stringify(message));
    }
}

const muteVideo = (dataChannel, localStream, videoState) => {
const videoTrack = localStream.getVideoTracks()[0];
videoTrack.enabled = !videoState;

// Send a message to the remote peer over the data channel
const message = {
    type: 'mute-track',
    trackType: 'video',
    muted: videoState
};
for (const id in dataChannel) {
    dataChannel[id].send(JSON.stringify(message));
}
}

const endStream = (stream) => {
    stream.getTracks().forEach(function(track) {
        track.stop();
    });
}

const localStreamReducer = (state, action) => {
    switch (action.type) {
        case 'stream':
        const audioTrack = action.value.stream.getAudioTracks()[0];
        audioTrack.enabled = state.mic;
        const videoTrack = action.value.stream.getVideoTracks()[0];
        videoTrack.enabled = state.cam;
        return {stream: action.value.stream, desk: state.desk, mic: state.mic, cam: state.cam};
        case 'desk':
        if(!action.value.desk) {
            endStream(state.desk);
        }
        return {stream: state.stream, desk: action.value.desk, mic: state.mic, cam: state.cam};
        case 'audio':
        if(state.stream) {
            muteAudio(action.value.dataChannel, state.stream, state.mic);
        }    
        return {stream: state.stream, desk: state.desk, mic: !state.mic, cam: state.cam};
        case 'video':
        if(state.stream) {
            muteVideo(action.value.dataChannel, state.stream, state.cam);
        }
        return {stream: state.stream, desk: state.desk, mic: state.mic, cam: !state.cam};
        case 'end':
        return {stream: false, desk: false, mic: false, cam: false};
        default:
        throw new Error();
    }
}

const remoteStreamsReducer = (state, action) => {
    switch (action.type) {
        case 'add':
        const exist = state.users.find(item => item.id === action.value.id);
        if(exist === undefined) {
            return {users: [...state.users, action.value], desk: state.desk};
        } else {
            return {users: state.users, desk: [...state.desk, action.value]};
        }
        case 'removeDemo':
        let newDemoStreams = state.desk.filter(function(item) { return item.id !== action.value });
        return {users: state.users, desk: newDemoStreams};
        case 'remove':
        let newStreams1 = state.users.filter(function(item) { return item.id !== action.value });
        let newStreams2 = state.desk.filter(function(item) { return item.id !== action.value });
        return {users: newStreams1, desk: newStreams2};
        case 'mute':
        const user = state.users.find(item => item.id === action.value.id);
        let track = null;
        if(action.value.trackType === 'audio') {
            track = user.stream.getAudioTracks()[0];
        }
        if(action.value.trackType === 'video') {
            track = user.stream.getVideoTracks()[0];
        }
        if (track) {
            track.enabled = !action.value.muted;
        }
        return {users: state.users, desk: state.desk};
        case 'empty':
        return {users: [], desk: []};
        default:
        throw new Error();
    }
}

export const useWebRTC = (host, localUsername, roomName, settings, addNotification) => {
    const socket = useRef(null);
    const pc = useRef({}); // For RTCPeerConnection Objects
    const dataChannel = useRef({}); 
    const [localStreamState, localStreamDispatch] = useReducer(localStreamReducer, 
        {stream: false, desk: false, mic: settings.mic, cam: settings.cam});
    const [remoteStreamsState, remoteStreamsDispatch] = useReducer(remoteStreamsReducer,
        {users: [], desk: []});
    const cameraStream = useRef();
    const endConnection = useRef();
    const setDeskStream = useRef();
    const setCameraStream = useRef((stream) => {
        cameraStream.current = stream;
        localStreamDispatch({type: 'stream', value: {stream: stream}})
    });

    const handleVideo = () => localStreamDispatch(
        {type: 'video', value: {dataChannel: dataChannel.current} }
        );

    const handleAudio = () => localStreamDispatch(
        {type: 'audio', value: {dataChannel: dataChannel.current}}
        );

    useEffect(() => {
        const handleTabClosing = (event) => {
            event.preventDefault();
            endConnection.current();
        }
        window.addEventListener('beforeunload', handleTabClosing);
        socket.current = socketio(host, connectionOptions);
        socket.current.on("room_full", () => {
            console.log("Room is full!");
            localStreamDispatch({type: 'end'});
            endConnection.current();
        });
        socket.current.on("leave", (username) => {
            console.log("Disconnect!");
            pc.current[username].close();
            delete pc.current[username];
            delete dataChannel.current[username];
            remoteStreamsDispatch({type: 'remove', value: username});
            addNotification(username + " left", 'info');
        });
        return function cleanup() {
            endConnection.current();
            window.removeEventListener('beforeunload', handleTabClosing);
        };
    }, [host, addNotification]);

    useEffect(() => {
        const sendData = (data) => {
            socket.current.emit("data", {
            username: localUsername,
            room: roomName,
            data: data,
            });
        };
    
        const onIceCandidate = (sid) => {
            return (event) => {
            if (event.candidate) {
            console.log("Sending ICE candidate");
            sendData({description: {
                type: "candidate",
                candidate: event.candidate,
            }, id: sid,});
            }}
        };
    
        const onAddStream = (sid) => {
            return (event) => {
            remoteStreamsDispatch({type: 'add', value: {id: sid, stream: event.stream}});
        };}
    
        const onRemoveStream = (sid) => {
            return (event) => {
            remoteStreamsDispatch({type: 'removeDemo', value: sid});
        };}
    
        const createPeerConnection = (sid) => {
            try {
            pc.current[sid] = new RTCPeerConnection(STUN_SERVERS);
            pc.current[sid].onicecandidate = onIceCandidate(sid);
            pc.current[sid].onaddstream = onAddStream(sid);
            pc.current[sid].onremovestream = onRemoveStream(sid);
            pc.current[sid].addStream(localStreamState.stream);
            dataChannel.current[sid] = pc.current[sid].createDataChannel('my-channel');
            dataChannel.current[sid].onopen = () => {
                console.log('Data channel is open');
                const videoState = localStreamState.stream.getVideoTracks()[0].enabled;
                const audioState = localStreamState.stream.getAudioTracks()[0].enabled;
                const audioMessage = {
                type: 'mute-track',
                trackType: 'audio',
                muted: !audioState
                };
                dataChannel.current[sid].send(JSON.stringify(audioMessage));
                const videoMessage = {
                type: 'mute-track',
                trackType: 'video',
                muted: !videoState
                };
                dataChannel.current[sid].send(JSON.stringify(videoMessage));
            }
            pc.current[sid].ondatachannel = (event) => {
                const dataChannel = event.channel;
                dataChannel.onopen = () => {
                console.log('Data channel is open for recieving');
                }
                dataChannel.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'mute-track') {
                    remoteStreamsDispatch({type: 'mute', value: {id: sid, trackType: message.trackType, muted: message.muted}});
                }
                };
            };
            if(localStreamState.desk) {
                pc.current[sid].addStream(localStreamState.desk);
            }
            console.log("PeerConnection created", sid);
            } catch (error) {
            console.error("PeerConnection failed: ", error);
            }
        };
    
        const setAndSendLocalDescription = (sid) => {
            return (sessionDescription) => {
            pc.current[sid].setLocalDescription(sessionDescription);
            console.log("Local description set", sid);
            sendData({description:sessionDescription, id: sid,});
        };}
    
        const sendOffer = (sid) => {
            console.log("Sending offer", sid);
            pc.current[sid].createOffer().then(setAndSendLocalDescription(sid), (error) => {
            console.error("Send offer failed: ", error);
            });
        };
    
        const sendAnswer = (sid) => {
            console.log("Sending answer");
            pc.current[sid].createAnswer().then(setAndSendLocalDescription(sid), (error) => {
            console.error("Send answer failed: ", error);
            });
        };
    
        const signalingDataHandler = (data, username) => {
            if(data.id === localUsername) {
            if (data.description.type === "offer") {
                if (pc.current[username] === undefined) {
                createPeerConnection(username);
                }
                pc.current[username].setRemoteDescription(new RTCSessionDescription(data.description));
                sendAnswer(username);
            } else if (data.description.type === "answer") {
                pc.current[username].setRemoteDescription(new RTCSessionDescription(data.description));
            } else if (data.description.type === "candidate") {
                pc.current[username].addIceCandidate(new RTCIceCandidate(data.description.candidate));
            } else {
                console.log("Unknown Data");
            }
            }
        };

        endConnection.current = () => {
            if(localStreamState.stream) {
                endStream(localStreamState.stream);
            }
            if(localStreamState.desk) {
                endStream(localStreamState.desk);
            }
            socket.current.emit("leave", { username: localUsername, room: roomName });
            socket.current.close();
            for (let sid in pc.current) {
            pc.current[sid].close();
            }
            remoteStreamsDispatch({type: 'empty'});
        };

        setDeskStream.current = (stream) => {
            if(stream) {
                localStreamDispatch({type: 'desk', value: {desk: stream} })
                for (let sid in pc.current) {
                pc.current[sid].addStream(stream);
                sendOffer(sid);
            }
            } else {
                localStreamDispatch({type: 'desk', value: {desk: false} })
                for (let sid in pc.current) {
                    pc.current[sid].removeStream(localStreamState.desk);
                    sendOffer(sid);
                }
            }
        }

        if(localStreamState.stream) {
            setCameraStream.current = (stream) => {
                replaceTracks(cameraStream.current, stream, pc.current, sendOffer);
                cameraStream.current = stream;
                localStreamDispatch({type: 'stream', value: {stream: stream} })
            }
        } else {
            setCameraStream.current = (stream) => {
                cameraStream.current = stream;
                localStreamDispatch({type: 'stream', value: {stream: stream} })
            }
        }

        if(localStreamState.stream){
            socket.current.off("ready");
            socket.current.on("ready", (username) => {
                console.log("Ready to Connect!");
                createPeerConnection(username);
                sendOffer(username);
                addNotification(username + " joined", 'info');
            });
            socket.current.off("data");
            socket.current.on("data", (data, username) => {
                signalingDataHandler(data, username);
            });
        }
    }, [localStreamState.stream, localStreamState.desk, localUsername, roomName, addNotification]);

    useEffect(() => {
        if(localStreamState.stream && !socket.current.connected){
            socket.current.connect();
            socket.current.emit("join", { username: localUsername, room: roomName });
        }
    }, [localStreamState.stream, localUsername, roomName]);

    return {
        socket,
        localStreamState, 
        remoteStreamsState, 
        setCameraStream, 
        handleVideo,
        handleAudio,
        setDeskStream, 
        endConnection
    };
};
