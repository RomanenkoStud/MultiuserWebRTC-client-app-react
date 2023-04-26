import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import { 
    CssBaseline, 
    Link,
    Button, 
    Typography, 
    Container, 
    Grid, 
    Icon, 
    Box, 
    Zoom, 
    Fade, 
    Card, 
    CardContent,
    CardActions,
    Stepper, Step, StepLabel,
    styled 
} from '@mui/material';
import { 
    DesktopMac as DesktopMacIcon, 
    Image as ImageIcon, 
    VideoCall as VideoCallIcon 
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState, useRef, useEffect } from 'react';
import { useSpring, useTrail, animated } from 'react-spring';
import Carousel from "react-material-ui-carousel";
import version from "../version";

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

/*const info = [
    {
        title: 'About Us',
        description: `RoomConnect is a free and easy-to-use video conferencing app. Our mission is to provide a reliable and secure platform for people to connect virtually.`,
    },
    {
        title: 'Why Choose RoomConnect',
        description: `We offer a user-friendly interface, secure and reliable connections, and a customizable conference room. Our app is perfect for both personal and professional use.`,
    },
    {
        title: 'How it Works',
        description: `To create a room, simply click "Create Room" and customize your conference room settings. To join a room, click "Join Room" and enter the room code or link provided by the host.`,
    },
];*/

const howToUseSteps = [
    {
        label: 'Step 1',
        description: 'Create a new room by clicking the "Create Room" button on the homepage.',
    },
    {
        label: 'Step 2',
        description: 'Once the room is created, you can copy the link or code to share with others.',
    },
    {
        label: 'Step 3',
        description: 'If you want to join an existing room, click the "Join Room" button on the homepage and enter the room code or link.',
    },
    {
        label: 'Step 4',
        description: 'Enjoy your video conference with other participants!',
    }
];

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

const HowToUseGuide = () => {
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prevActiveStep) =>
            prevActiveStep === howToUseSteps.length - 1 ? 0 : prevActiveStep + 1
            );
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
    const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
    setActiveStep(0);
    };

    const springProps = useSpring({
        opacity: 1,
        transform: 'translate3d(0,0,0)',
        from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
    });

    return (
        <Grid item sx={{ mt: 8, width: '80%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                How to Use Guide
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
                {howToUseSteps.map((step, index) => (
                <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    {activeStep === index && !isSmallScreen && (
                    <animated.div style={springProps}>
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', height: 75 }}>
                        {step.description}
                        </Typography>
                    </animated.div>
                    )}
                </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 4 }}>
                {isSmallScreen && (
                    <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', height: 90 }}>
                        {howToUseSteps[activeStep].description}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 2 }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={activeStep === howToUseSteps.length - 1 ? handleFinish : handleNext}
                    >
                        {activeStep === howToUseSteps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
}

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
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const renderPlan = (plan) => {
        return (
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
        );
    }
    
    return (
        <Grid item xs={12} justifyContent="center">
        {isSmallScreen ? (
            <Carousel autoPlay={false} sx={{
                animation: 'slide 1s ease-in-out',
                '& .slick-slide': {
                    padding: '0 8px',
                },
            }}>
            {plans.map((plan) => (
                <Container key={plan.title} sx={{minHeight: 350, display: "flex", justifyContent: "center", alignItems: "center"}}>
                    {renderPlan(plan)}
                </Container>
            ))}
            </Carousel>
        ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
            {plans.map((plan) => (
                renderPlan(plan)
            ))}
            </Box>
        )}
        </Grid>
    );
};

const Footer = () => {
    return (
        <Box sx={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem' }}>
        <Typography variant="body2" color="textSecondary">
            Created by @RomanenkoStud using:
        </Typography>
        <Typography variant="body2" color="textSecondary">
            React.js | Redux | Material-UI | React Router | Socket.IO | WebRTC | Mediapipe | React Spring
        </Typography>
        <Box sx={{ marginTop: '1rem' }}>
            <Typography variant="body2" color="textSecondary">
            Check out the code on GitHub:
            </Typography>
            <Typography variant="body2" color="textSecondary">
            <Link href="[Your GitHub repository URL]" target="_blank" rel="noopener noreferrer" underline="hover">
                Frontend
            </Link>{" | "}
            <Link href="[Your GitHub repository URL]" target="_blank" rel="noopener noreferrer" underline="hover">
                Backend
            </Link>
            </Typography>
        </Box>
        <Typography variant="caption" color="textSecondary">
            © 2023 RoomConnect | Version {version}
        </Typography>
    </Box>
    );
};

const HomeView = () => {
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const additionalInfoRef = useRef(null);
    const theme = useTheme();
    const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
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
        <Grid container spacing={3} sx={{ marginBottom: 10 }}>
            <Grid item xs={12} sm={12} md={6} sx={{height: "100%"}}>
            <Zoom in={true} timeout={2000}>
                <img src="/images/videoCallDemo1.jpg" alt="Video icon" style={{ width: '100%', filter: theme.palette.mode === 'dark' ? 'brightness(75%)' : 'none' }} />
            </Zoom>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
            <Typography variant={matchesMd ? "h3" : "h2"} component="h1" gutterBottom>
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
            <Box  sx={matchesMd && {display: 'flex', justifyContent: 'center'}}>
                <LinkWithLogoAnimation to={'/rooms/create'} style={{ textDecoration: 'none' }}>
                <ActionButton variant="contained" color="primary">
                    Create Room
                </ActionButton>
                </LinkWithLogoAnimation>
                <LinkWithLogoAnimation to={'/rooms/connect'} style={{ textDecoration: 'none'}}>
                <ActionButton variant="outlined" color="primary">
                    Join Room
                </ActionButton>
                </LinkWithLogoAnimation>
            </Box>
            </Grid>
            <Grid container spacing={3} justifyContent="center">
                <HowToUseGuide/>
            </Grid>
            <Grid container spacing={1} justifyContent="center" sx={{ marginTop: 1 }} ref={additionalInfoRef}>
            {showAdditionalInfo && (
                <>
                <Typography variant="h4" gutterBottom sx={{ marginTop: 5 }}>
                    Features
                </Typography>
                <ShuffleList list={features} interval={10000} />
                <Typography variant="h4" gutterBottom sx={{ marginTop: 5 }}>
                    Pricing
                </Typography>
                <Pricing />
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

export default HomeView;