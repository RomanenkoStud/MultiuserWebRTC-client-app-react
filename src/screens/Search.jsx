import React, { useState } from 'react';
import {
    CssBaseline,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Grid,
    Typography,
    Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        // TODO: Implement search functionality
    };

    return (
        <Box sx={{ p: 2 }}>
            <CssBaseline />
        <Typography variant="h5" gutterBottom>
            Search Rooms
        </Typography>
        <form onSubmit={handleSearch}>
            <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a keyword to search rooms"
            fullWidth
            variant="outlined"
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <IconButton type="submit">
                    <SearchIcon />
                    </IconButton>
                </InputAdornment>
                ),
            }}
            />
        </form>
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
            {/* TODO: Render search results */}
            <Grid item xs={12}>
                <Button variant="contained" fullWidth>
                Create New Room
                </Button>
            </Grid>
            </Grid>
        </Box>
        </Box>
    );
};

export default Search;