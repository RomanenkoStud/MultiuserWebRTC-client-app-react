import { useState } from 'react';
import { Box, Button, Grid, Typography, CssBaseline } from '@mui/material';
import Rating from "../components/Rating";

const AfterCallView = ({handleReturn, onRating}) => {
    const defaultRating = 3;
    const [rating, setRating] = useState(defaultRating);

    const handleRating = (value) => {
        setRating(value);
    };

    const handleSubmit = () => {
        // Handle submitting the rating data
        // ...
    };

    return (
        <Box sx={{ 
            p: 2, 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: '80vh',
            }}>
            <CssBaseline />
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item>
                <Typography variant="h4">How was the call?</Typography>
                </Grid>
                <Grid item>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Rating
                        defaultRating={defaultRating}
                        value={rating}
                        handleRating={handleRating}
                        iconSize={"3rem"}
                    />
                </Box>
                </Grid>
                <Grid item>
                <Button variant="contained" onClick={handleSubmit} disabled={rating === null}>
                    Submit Rating
                </Button>
                </Grid>
                <Grid item>
                <Button variant="outlined" onClick={() => handleReturn()}>
                    Return to Call
                </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AfterCallView;