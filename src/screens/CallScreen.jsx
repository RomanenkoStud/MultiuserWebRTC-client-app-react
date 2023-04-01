import { useParams } from "react-router-dom";
import { useState } from "react";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
//import { Typography } from '@mui/material';
import InCall from "./InCall";
import Preview from "./Preview";
import { useDispatch, useSelector } from "react-redux";
import { changeConfig } from "../store/slices/settingsSlice";

function CallScreen() {
  const params = useParams();
  const username = params.username;
  const room = params.room;
  const { navigate } = useLogoAnimation();
  const [inCall, setInCall] = useState(false);
  const onStart = () => {
    setInCall(true);
  }

  const settings = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const onSetSettings = (newSettings) => {
    dispatch(changeConfig(newSettings));
  }

  const onEnd = () => {
    setInCall(false);
    navigate("/");
  }
  
  if(inCall) {
    return (
      <InCall username={username} room={room} settings={settings} onEnd={onEnd}/>
    );
  } else {
    return (
      <Preview settings={settings} setSettings={onSetSettings} onStart={onStart}/>
    );
  }
}

export default CallScreen;