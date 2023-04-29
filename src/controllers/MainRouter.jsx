import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserController from "./UserController";
import CallsController from "./CallsController";
import SettingsController from "./SettingsController";
import RoomController from "./RoomController";
import LoginView from "../views/LoginView";
import HomeView from "../views/HomeView";
import NotFoundView from "../views/NotFoundView";
import NavBar from "../components/NavBar/NavBar";

function MainRouter() {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/call/:username/:room/*" element={<CallsController />} />
                <Route path="/user/*" element={<UserController />} />
                <Route path="/rooms/*" element={<RoomController />} />
                <Route path="/settings/" element={<SettingsController />} />
                <Route path="/login/" element={<LoginView />} />
                <Route path="*" element={<NotFoundView />} />
            </Routes>
        </Router>
    );
}

export default MainRouter;