import { Link as RouterLink } from "react-router-dom";
import { Typography, Button, Box, CssBaseline } from "@mui/material";
import { useSpring, animated } from 'react-spring';


const NotFoundView = () => {
    const bounce = useSpring({
        from: { transform: 'translateY(0px)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateY(-20px)' });
                await next({ transform: 'translateY(0px)' });
                await next({ transform: 'translateY(5px)' });
            }
        },
    });
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: '80vh',
        }}
        >
            <CssBaseline />
            <animated.h1 style={{ ...bounce, fontSize: '6rem', margin: 0 }}>404</animated.h1>
            <Typography variant="h4" gutterBottom sx={{mt: 0 }}>
                Page not found
            </Typography>
            <Button
                component={RouterLink}
                to="/"
                variant="contained"
                color="primary"
            >
                Go back to Home
            </Button>
        </Box>
    );
};

export default NotFoundView;