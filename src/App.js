import MainRouter from "./controllers/MainRouter";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LogoAnimationProvider } from './components/NavBar/LogoAnimationContext';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import AuthController from "./controllers/AuthController";

const theme = createTheme({
    palette: {
      primary: {
        light: '#286c33',
        main: '#214e28',
        dark: '#131312',
        contrastText: '#fcfcfc',
      },
      background: {
        default: "#e4f0e2"
      }
    },
  });

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <LogoAnimationProvider>
            <AuthController>
              <MainRouter/>
            </AuthController>
          </LogoAnimationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;