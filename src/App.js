import React from 'react';
import AppTheme from "./components/AppTheme";
import MainRouter from "./controllers/MainRouter";
import { LogoAnimationProvider } from './components/NavBar/LogoAnimationContext';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import AuthController from "./controllers/AuthController";


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppTheme>
          <LogoAnimationProvider>
            <AuthController>
              <MainRouter/>
            </AuthController>
          </LogoAnimationProvider>
        </AppTheme>
      </PersistGate>
    </Provider>
  );
}

export default App;