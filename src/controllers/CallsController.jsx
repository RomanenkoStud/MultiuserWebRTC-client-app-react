import { useParams } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
import InCallView from "../views/InCallView";
import PreviewView from "../views/PreviewView";
import AfterCallView from "../views/AfterCallView";
import { useDispatch, useSelector } from "react-redux";
import { changeConfig } from "../store/slices/settingsSlice";
import socketio from "socket.io-client";

const connectionOptions = {
    autoConnect: false,
};

//const host = "http://localhost:8000/";
const host = "https://azure-flask-socketio.azurewebsites.net/";

export default function CallsController() {
  const params = useParams();
  const username = params.username;
  const roomId = params.room;
  const { navigate } = useLogoAnimation();
  const [inCall, setInCall] = useState(false);
  const settings = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const userInfo = isLoggedIn ? user : {id: username, username: username, imageUrl: null};

  const socket = useRef(socketio(host, connectionOptions));
  useEffect(() => {
    const socketRef = socket.current;
    return function cleanup() {
      socketRef.emit("leave", {room: roomId});
    };
  }, [roomId]);

  const onStart = () => {
    socket.current.connect();
  }

  const onJoin = () => {
    setInCall(true);
  }

  const onSettings = (name, checked) => {
    dispatch(changeConfig({ ...settings, [name]: checked }));
  }

  const onEnd = () => {
    setInCall(false);
    socket.current.emit("leave", {room: roomId});
    navigate(`/call/${username}/${roomId}/rate`);
  }

  const onReturn = () => {
    navigate(`/call/${username}/${roomId}`);
  }

  const onRating = () => {
    navigate(`/`);
  }

  const CallView = inCall ? (
        <InCallView 
        socket={socket} 
        user={userInfo} 
        room={roomId} 
        settings={settings} 
        onEnd={onEnd}/>
      ) : (
        <PreviewView 
        socket={socket} 
        user={userInfo} 
        room={roomId} 
        settings={settings} 
        onSettings={onSettings} 
        onStart={onStart}
        onJoin={onJoin}
        />
      );

  return (
    <Routes>
        <Route path="/" element={CallView} />
        <Route path="/rate" element={<AfterCallView handleReturn={onReturn} onRating={onRating}/>} />
    </Routes>
);
}