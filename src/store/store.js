import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';

const userPersistConfig = {
    key: "user",
    storage,
};

const settingsPersistConfig = {
    key: "settings",
    storage,
};

const authPersistedReducer = persistReducer(userPersistConfig, authReducer);
const settingsPersistedReducer = persistReducer(settingsPersistConfig, settingsReducer);

const store = configureStore({
    reducer: {
        auth: authPersistedReducer,
        settings: settingsPersistedReducer,
    },
});

const persistor = persistStore(store);

export { store, persistor };