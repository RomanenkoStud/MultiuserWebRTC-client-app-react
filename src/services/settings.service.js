class SettingsService {
    constructor(defaultSettings) {
        this.defaultSettings = defaultSettings;
        this.settings = this.getCurrentSettings();
        if(!this.settings) {
            this.settings = this.defaultSettings;
            this.saveSettings();
        }
    }

    saveSettings() {
        localStorage.setItem("settings", JSON.stringify(this.settings));
    }

    updateSettings(newSettings) {
        this.settings = {...this.settings, ...newSettings};
        this.saveSettings();
    }

    resetSettings() {
        this.settings = this.defaultSettings;
        this.saveSettings();
    }

    getCurrentSettings() {
        const settings = localStorage.getItem('settings');
        if(settings) {
            return JSON.parse(settings);
        }
        return null;
    }
}

const defaultSettings = {
    mic: false,
    cam: false,
    blur: false,
}
const settingsService = new SettingsService(defaultSettings);

export default settingsService;