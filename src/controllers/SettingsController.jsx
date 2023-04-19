import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, changeConfig } from '../store/slices/settingsSlice';
import SettingsView from "../views/SettingsView";

export default function SettingsController() {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const handleTheme = (mode) => {
        dispatch(changeTheme(mode));
    };

    const handleConfig = (name, checked) => {
        dispatch(changeConfig({ [name]: checked }));
    };

    return (
        <SettingsView settings={settings} handleTheme={handleTheme} handleConfig={handleConfig}/>
    );
}