import { useParams } from "react-router-dom";
import { useState } from "react";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
//import { Typography } from '@mui/material';
import InCall from "./InCall";
import Preview from "./Preview";
import settingsService from "../services/settings.service";

function CallScreen() {
  const params = useParams();
  const username = params.username;
  const room = params.room;
  const { navigate } = useLogoAnimation();
  const [inCall, setInCall] = useState(false);
  const [settings, setSettings] = useState(settingsService.settings);
  const onStart = () => {
    setInCall(true);
  }

  const onSetSettings = (newSettings) => {
    settingsService.updateSettings(newSettings);
    setSettings(newSettings);
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