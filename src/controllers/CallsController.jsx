import { useParams } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { useState } from "react";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
import InCallView from "../views/InCallView";
import PreviewView from "../views/PreviewView";
import AfterCallView from "../views/AfterCallView";
import { useDispatch, useSelector } from "react-redux";
import { changeConfig } from "../store/slices/settingsSlice";
import roomService from "../services/room.service";

export default function CallsController() {
  const params = useParams();
  const username = params.username;
  const roomId = params.room;
  const { navigate } = useLogoAnimation();
  const [inCall, setInCall] = useState(false);
  const settings = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const onStart = (setMessage) => {
    roomService.join(username, roomId).then(
      (response) => {
          setMessage({message: "Successful", successful: true, loading: false});
          setTimeout(() => {
            setInCall(true);
          }, 1000); // 3 second message delay
      },
      (error) => {
          setMessage({message: error, successful: false, loading: false});
      }
    );
  }

  const onSettings = (name, checked) => {
    dispatch(changeConfig({ ...settings, [name]: checked }));
  }

  const onEnd = () => {
    roomService.leave(username, roomId).then(
      (response) => {
        setInCall(false);
        navigate(`/call/${username}/${roomId}/rate`);
      },
      (error) => {

      }
    );
  }

  const onReturn = () => {
    navigate(`/call/${username}/${roomId}`);
  }

  const CallView = inCall ? (
        <InCallView username={username} room={roomId} settings={settings} onEnd={onEnd}/>
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