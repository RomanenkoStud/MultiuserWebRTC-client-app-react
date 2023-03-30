import CssBaseline from '@mui/material/CssBaseline';
import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useState, useRef, useEffect } from 'react';
import { useTrail, animated } from 'react-spring';
import { Card, CardContent,CardActions } from '@mui/material';

const HomeContainer = styled(Container)({
    marginTop: '4rem',
    marginBottom: '4rem',
});

const Description = styled('div')({
    marginBottom: '4rem',
});

const ActionButton = styled(Button)({
    marginRight: '2rem',
});

const features = [
    {
        title: 'Screen Sharing',
        description:
        'Share your screen with other participants to present documents, slides, or other content.',
        icon: <DesktopMacIcon fontSize="large" />,
    },
    {
        title: 'Virtual Backgrounds',
        description:
        'Choose from a variety of virtual backgrounds to create a professional or fun atmosphere during your calls.',
        icon: <ImageIcon fontSize="large" />,
    },
    {
        title: 'Recording',
        description:
        'Record your video meetings for future reference or to share with participants who could not attend.',
        icon: <VideoCallIcon fontSize="large" />,
    },
];

const plans = [
    {
        title: "Free Plan",
        description: "Perfect for small teams",
        features: ["- Up to 4 participants per meeting", "- Unlimited meetings", "- Basic features included"],
        price: "$0/month",
        buttonText: "Get Started",
        disabled: false,
    },
    {
        title: "Premium Plan",
        description: "For larger teams or more advanced features",
        features: ["- Up to 50 participants per meeting", "- Unlimited meetings", "- Advanced features included", "- Priority support"],
        price: "$unknown",
        buttonText: "Upgrade Now",
        disabled: true,
    },
];

const ShuffleList = ({ list, interval }) => {
    const [shuffle, setShuffle] = useState(false);
    const [currentList, setCurrentList] = useState(list);

    // Define a trail of animated values for each item
    const trail = useTrail(list.length, {
        from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
        to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
        // Shuffle the items randomly
        config: { duration: 1000 },
        reset: shuffle,
    });

    // Shuffle the items every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
        const shuffledList = currentList.sort(() => Math.random() - 0.5);
        setCurrentList(shuffledList)
        setShuffle(true);
        setTimeout(() => setShuffle(false), 1000);
        }, interval);

        return () => clearInterval(timer);
    }, [interval, currentList]);

    return (
        <Grid container spacing={3} justifyContent="center">
        {trail.map((styles, index) => (
        <Grid item xs={8} md={4} key={list[index].title}>
            <animated.div style={styles}>
            <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                <Icon style={{ fontSize: '4rem', marginBottom: '1rem' }}>{list[index].icon}</Icon>
                <Typography variant="h5" gutterBottom>
                    {list[index].title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {list[index].description}
                </Typography>
                </CardContent>
            </Card>
            </animated.div>
        </Grid>
        ))}
    </Grid>
);
};

const Pricing = () => {
    return (
        <Grid container spacing={3} justifyContent="center">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
            {plans.map((plan) => (
            <Card sx={{ maxWidth: 345, marginLeft: plan.title === "Premium Plan" ? 2 : 0 }} key={plan.title}>
                <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {plan.title}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {plan.description}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {plan.features.map((feature, index) => (
                    <>
                        {feature}
                        <br />
                    </>
                    ))}
                </Typography>
                <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
                    {plan.price}
                </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "center", paddingBottom: 2 }}>
                <Button variant="contained" disabled={plan.disabled} sx={{ backgroundColor: plan.disabled ? "gray" : undefined }}>
                    {plan.buttonText}
                </Button>
                </CardActions>
            </Card>
            ))}
        </Box>
        </Grid>
    );
};

const Footer = () => {
    return (
        <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="body2" color="textSecondary">
            Created by [Your Name] using:
        </Typography>
        <Typography variant="body2" color="textSecondary">
            React.js | Node.js | Express.js | MongoDB | Material-UI | React Router | Socket.IO | WebRTC
        </Typography>
        <Box sx={{ marginTop: '1rem' }}>
            <Typography variant="body2" color="textSecondary">
            Check out the code on GitHub:
            </Typography>
            <Typography variant="body2" color="textSecondary">
            <a href="[Your GitHub repository URL]" target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>Frontend</a> {" | "} 
            <a href="[Your GitHub repository URL]" target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>Backend</a>
            </Typography>
        </Box>
        </Box>
    );
};

const HomeScreen = () => {
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const additionalInfoRef = useRef(null);
    useEffect(() => {
        if (showAdditionalInfo && additionalInfoRef.current) {
            additionalInfoRef.current.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo(0, 0);
        }
    }, [showAdditionalInfo]);
    
    const toggleAdditionalInfo = () => {
        setShowAdditionalInfo(!showAdditionalInfo);
    }
    
    return (
        <HomeContainer>
        <CssBaseline />
        <Grid container spacing={3} sx={{marginBottom: 10,}}>
            <Grid item xs={12} sm={6}>
            <Zoom in={true} timeout={2000}>
                <img src="/images/videoCallDemo1.jpg" alt="Video icon" style={{ width: '100%' }} />
            </Zoom>
            </Grid>
            <Grid item xs={12} sm={6}>
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to RoomConnect!
            </Typography>
            <Fade in={true} timeout={1000}>
                <Description>
                <Typography variant="body1" gutterBottom>
                    Our app allows you to host or join video conferences with ease.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You can use your camera, microphone, and share your screen during the conference.
                </Typography>
                </Description>
            </Fade>
            <Box>
                <ActionButton component={LinkWithLogoAnimation} to="/connect" variant="contained" color="primary">
                Create Room
                </ActionButton>
                <ActionButton component={LinkWithLogoAnimation} to="/connect" variant="outlined" color="primary">
                Join Room
                </ActionButton>
            </Box>
            </Grid>
            <Grid container spacing={1} justifyContent="center" sx={{marginTop: 1,}} ref={additionalInfoRef}>
            {showAdditionalInfo && (
                <>
                <Typography variant="h4" gutterBottom sx={{marginTop: 5,}}>
                    Features
                </Typography>
                <ShuffleList list={features} interval={10000}/>
                <Typography variant="h4" gutterBottom sx={{ marginTop: 5 }}>
                    Pricing
                </Typography>
                <Pricing/>
                {/* add additional content for my homepage here */}
                </>
            )}
            <Box sx={{ marginTop: '2rem' }}>
                <Button variant="outlined" onClick={toggleAdditionalInfo}>
                {showAdditionalInfo ? 'Hide' : 'Show more'}
                </Button>
            </Box>
            </Grid>
        </Grid>
        <Footer />
        </HomeContainer>
    );
};

export default HomeScreen;