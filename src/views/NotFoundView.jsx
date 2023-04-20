import { Typography, Box, CssBaseline } from "@mui/material";
import { useSpring, animated } from 'react-spring';
import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import { useTheme } from '@mui/material/styles';

const NotFoundView = () => {
    const theme = useTheme();
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
            <animated.div style={{ ...bounce, margin: 0 }}>
                <Typography variant="h2" gutterBottom>
                    404
                </Typography>
            </animated.div>
            <Typography variant="h8" gutterBottom sx={{mt: 0 }} >
                Page not found. Go to <LinkWithLogoAnimation to="/" style={{ color: theme.palette.primary.light }}>Home</LinkWithLogoAnimation>
            </Typography>
        </Box>
    );
};

export default NotFoundView;