import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouteList from "./screens/RouteList";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavBar from "./components/NavBar/NavBar";
import { LogoAnimationProvider } from './components/NavBar/LogoAnimationContext';
import authService from "./services/auth.service";

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
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    authService.logout();
    setCurrentUser(undefined);
  }

  const logIn = (user) => {
    setCurrentUser(user);
  }

  return (
    <ThemeProvider theme={theme}>
      <LogoAnimationProvider>
          <Router>
            <NavBar currentUser={currentUser} logOut={logOut}/>
            <RouteList currentUser={currentUser} logIn={logIn}/>
          </Router>
      </LogoAnimationProvider>
    </ThemeProvider>
  );
}

export default App;