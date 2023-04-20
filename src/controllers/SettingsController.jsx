import { useDispatch, useSelector } from 'react-redux';
import { changeConfig } from '../store/slices/settingsSlice';
import SettingsView from "../views/SettingsView";

export default function SettingsController() {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const handleConfig = (name, checked) => {
        dispatch(changeConfig({ [name]: checked }));
    };

    return (
        <SettingsView settings={settings} handleConfig={handleConfig}/>
    );
}