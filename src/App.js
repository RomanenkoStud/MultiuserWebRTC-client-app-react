import { BrowserRouter as Router } from "react-router-dom";
import RouteList from "./screens/RouteList";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavBar from "./components/NavBar";

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
    <ThemeProvider theme={theme}>
    <NavBar></NavBar>
      <Router>
        <RouteList />
      </Router>
    </ThemeProvider>
  );
}

export default App;