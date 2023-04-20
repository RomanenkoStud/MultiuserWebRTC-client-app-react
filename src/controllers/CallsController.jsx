import { useParams } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { useState } from "react";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
import InCallView from "../views/InCallView";
import PreviewView from "../views/PreviewView";
import AfterCallView from "../views/AfterCallView";
import { useDispatch, useSelector } from "react-redux";
import { changeConfig } from "../store/slices/settingsSlice";

export default function CallsController() {
  const params = useParams();
  const username = params.username;
  const room = params.room;
  const { navigate } = useLogoAnimation();
  const [inCall, setInCall] = useState(false);
  const settings = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const onStart = () => {
    setInCall(true);
  }

  const onSettings = (name, checked) => {
    dispatch(changeConfig({ ...settings, [name]: checked }));
  }

  const onEnd = () => {
    setInCall(false);
    navigate(`/call/${username}/${room}/rate`);
  }

  const onReturn = () => {
    navigate(`/call/${username}/${room}`);
  }

  const CallView = inCall ? (
        <InCallView username={username} room={room} settings={settings} onEnd={onEnd}/>
      ) : (
        <PreviewView settings={settings} onSettings={onSettings} onStart={onStart}/>
      );

  return (
    <Routes>
        <Route path="/" element={CallView} />
        <Route path="/rate" element={<AfterCallView handleReturn={onReturn} />} />
    </Routes>
);
}