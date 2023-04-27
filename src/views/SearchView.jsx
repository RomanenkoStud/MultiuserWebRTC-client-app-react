import { useState, useEffect } from "react";
import { 
    CssBaseline, 
    CardActions, 
    Box, 
    Grid, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Avatar, 
    AvatarGroup,
    InputAdornment,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Drawer,
    IconButton 
} from "@mui/material";
import { 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    ListItemButton,
    ToggleButtonGroup,
    ToggleButton,
    Collapse,
    CircularProgress 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import DuoIcon from '@mui/icons-material/Duo';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useLogoAnimation } from "../hooks/useLogoAnimation";

const dateFormat = (date) => {
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
}

const UserAvatar = ({user}) => {
    return (
        <Avatar key={user.username} image={user.imageUrl}>
            {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.username}
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                }}/>
            ) : 
                user.username.charAt(0).toUpperCase()
            }
        </Avatar>
    );
}

const FilterChips = ({filters, setFilters, clear}) => {
    const handleFilterDelete = (filterToDelete) => {
        setFilters((prevFilters) => prevFilters.filter((filter) => filter !== filterToDelete));
    };

    const handleClearFilters = () => {
        setFilters([]);
    };
    
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {filters.map((filter) => (
                <Chip
                key={filter.id}
                label={`${filter.label}: ${filter.value}`}
                onDelete={() => handleFilterDelete(filter)}
                sx={{ marginRight: 1, marginBottom: 1 }}
                />
            ))}
            {clear && filters.length > 0 && (
            <Chip label="Clear" onClick={handleClearFilters} sx={{ marginRight: 1, marginBottom: 1 }} />
            )}
        </Box>
    );
}

const Filters = ({ appliedFilters, addFilters }) => {
    const [filters, setFilters] = useState([]);
    const filterTypes = [
        { id: "accessibility", label: "Accessibility", options: ["Private", "Public"] },
        { id: "date", label: "Date", options: ["Today", "Last week", "Last month", ] },
        { id: "participants", label: "Participants", options: ["1", "2", "3", "4"] },
    ];

    const handleFilterAdd = (filter) => {
    if (filter.value) {
        setFilters((prevFilters) => [...prevFilters, filter]);
    }
    };

    const handleApplyFilters = () => {
        addFilters(filters);
        setFilters([]);
    };

    const handleFiltersClear = () => {
        setFilters([]);
    };
    
    const randomId = Math.random().toString(36).substring(2, 8); // Generates a random string of 6 characters
    
    return (
    <Box>
        {filterTypes.map((filterType) => (
        <FormControl key={filterType.id} fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id={`${filterType.id}-select-label`}>{filterType.label}</InputLabel>
            <Select
            label={filterType.label}
            labelId={`${filterType.id}-select-label`}
            id={`${filterType.id}-select`}
            value={filters.find((filter) => filter.id === filterType.id)?.value || ""}
            onChange={(e) => handleFilterAdd({ label: filterType.label, id: filterType.id + '_' + randomId, value: e.target.value })}
            >
            {filterType.options.map((option) => {
                const selectedFilter = [...appliedFilters, ...filters].find((filter) => filter.id === filterType.id && filter.value === option);
                const isOptionSelected = selectedFilter !== undefined;
                return (
                    <MenuItem 
                    key={option} 
                    value={option} 
                    disabled={isOptionSelected}
                    style={isOptionSelected ? { color: 'grey' } : {}}
                    >
                    {option}
                    </MenuItem>
                );}
            )}
            </Select>
        </FormControl>
        ))}
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <FilterChips filters={filters} setFilters={setFilters}/>
        </Box>
        {filters.length !== 0 && <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button variant="outlined" onClick={handleFiltersClear}>
                Clear Filters
            </Button>
            <Button variant="contained" onClick={handleApplyFilters} sx={{ marginLeft: 1 }}>
                Apply Filters
            </Button>
        </Box>}
    </Box>
    );
};

const Sorting = ({sortType, setSortType}) => {
    const handleSortChange = (event) => {
        setSortType(event.target.value);
    };

    return (
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
                fullWidth
                variant="outlined"
                label="Sort By"
                labelId="sort-select-label"
                value={sortType}
                onChange={handleSortChange}
            >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="name-asc">Room Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Room Name: Z to A</MenuItem>
                <MenuItem value="users-asc">Users: Low to High</MenuItem>
                <MenuItem value="users-desc">Users: High to Low</MenuItem>
            </Select>
        </FormControl>
    );
}

const RoomsGrid = ({rooms, handleDelete}) => {
    const { navigate } = useLogoAnimation();

    return (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {rooms.map((room) => (
                <Grid item xs={12} md={6} lg={4} key={room.id}>
                    <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                        {room.roomname}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Max Users: {room.maxUsers}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Date: {dateFormat(room.date)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        {room.isPrivate ? "Private Room" : "Public Room"}
                        </Typography>
                        <AvatarGroup max={4} sx={{height: 44}}>
                            {room.users?.map((user) => (
                                <UserAvatar user={user}/>
                            ))}
                        </AvatarGroup>
                    </CardContent>
                    <CardActions>
                        <Button  variant="outlined" color="primary" 
                            onClick={()=>navigate(`/rooms/invite/${room.id}/${room.isPrivate}`)}
                        >
                            Join
                        </Button>
                        {handleDelete && (<Button  variant="outlined" color="error" 
                            onClick={()=>handleDelete(room.id)}
                        >
                            Delete
                        </Button>)}
                    </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

const RoomsList = ({ rooms, handleDelete }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { navigate } = useLogoAnimation();

    const handleRoomClick = (room) => {
        setSelectedRoom(selectedRoom === room ? null : room);
    };

    return (
        <List sx={{ marginTop: 2 }}>
            {rooms.map((room) => (
            <Box key={room.id}>
                <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="comments" 
                        onClick={()=>navigate(`/rooms/connect/${room.roomname}/${room.isPrivate}`)}
                    >
                        <DuoIcon />
                    </IconButton>
                }
                disablePadding
                >
                <ListItemButton onClick={() => handleRoomClick(room)}>
                    <ListItemAvatar>
                    {room.users ? (
                        <UserAvatar user={room.users[0]}/>
                    ) : (
                        <Avatar>{room.roomname.charAt(0).toUpperCase()}</Avatar>
                    )}
                    </ListItemAvatar>
                    <ListItemText primary={room.roomname} secondary={
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {`Max Users: ${room.maxUsers}`}
                        </Typography>} />
                    {selectedRoom === room ? <ExpandLess /> : <ExpandMore />}
                    {handleDelete && (
                        <IconButton edge="end" aria-label="comments" 
                            onClick={()=>handleDelete(room.id)}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    )}
                </ListItemButton>
                </ListItem>
                <Collapse in={selectedRoom === room} timeout="auto" unmountOnExit>
                    <Typography variant="body2" sx={{ pl: 10, color: 'text.secondary' }}>
                            {`Date: ${dateFormat(room.date)}`}
                            <br/>
                            {room.isPrivate ? "Private Room" : "Public Room"}
                    </Typography>
                </Collapse>
            </Box>
            ))}
        </List>
    );
};

const ViewToggle = ({ onViewChange }) => {
    const [viewType, setViewType] = useState('grid');

    const handleViewTypeChange = (event, newViewType) => {
        if (newViewType !== null) {
        setViewType(newViewType);
        onViewChange(newViewType);
        }
    };

    return (
        <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={handleViewTypeChange}
        aria-label="View Type"
        sx={{ mb: 2 }}
        >
        <ToggleButton value="list" aria-label="List View">
            <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="grid" aria-label="Grid View">
            <ViewModuleIcon />
        </ToggleButton>
        </ToggleButtonGroup>
    );
};

const SearchView = ({handleGetRooms, handleDelete, pollInterval=5000}) => {
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState([]);
    const [sortType, setSortType] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [viewType, setViewType] = useState('grid');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        handleGetRooms((data) => {
            setRooms(data);
            setLoading(false);
        });
        const intervalId = setInterval(() => {
            handleGetRooms(setRooms);
        }, pollInterval); // set short polling 
        return () => clearInterval(intervalId);
    }, [handleGetRooms, pollInterval]);

    const sort = (results) => {
        const sortedResults = results.slice();
        switch (sortType) {
            case "name-asc":
                return sortedResults.sort((a, b) => a.roomname.localeCompare(b.roomname));
            case "name-desc":
                return sortedResults.sort((a, b) => b.roomname.localeCompare(a.roomname));
            case "users-asc":
                return sortedResults.sort((a, b) => a.users.length - b.users.length);
            case "users-desc":
                return sortedResults.sort((a, b) => b.users.length - a.users.length);
            default:
                return sortedResults;
        }
    };

    const filter = (results) => {
        const filteredResults = results.filter((room) => {
            let accessibilityCheck = false;
            let dateCheck = false;
            let participantsCheck = false;
            
            filters.forEach((filter) => { // use Array.forEach() to check all filters
                if (filter.id === 'accessibility') {
                    if (filter.value === 'Private' && room.isPrivate === true) {
                        accessibilityCheck = true; 
                    }
                    if (filter.value === 'Public' && room.isPrivate !== true) {
                        accessibilityCheck = true; 
                    }
                } else if (filter.id === 'date') {
                    const today = new Date();
                    const roomDate = new Date(room.date);
                    if (filter.value === 'Today' && roomDate.toDateString() === today.toDateString()) {
                        dateCheck = true;
                    } else if (filter.value === 'Last week') {
                        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        if (roomDate >= lastWeek && roomDate < today) {
                        dateCheck = true; 
                        }
                    } else if (filter.value === 'Last month') {
                        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        if (roomDate >= lastMonth && roomDate < today) {
                        dateCheck = true; 
                        }
                    }
                } else if (filter.id === 'participants') {
                    if (room.users.length === parseInt(filter.value)) {
                        participantsCheck = true; 
                    }
                }
            });
        
            // Check if at least one condition is true for each group
            return (filters.some(filter => filter.id === 'accessibility') ? accessibilityCheck : true) &&
                    (filters.some(filter => filter.id === 'date') ? dateCheck : true) &&
                    (filters.some(filter => filter.id === 'participants') ? participantsCheck : true);
            });
        
        return filteredResults;
    };

    const addFilters = (filters) => {
        setFilters((prevFilters) => [...prevFilters, ...filters]);
    };
    
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearch(searchTerm.toLowerCase());
    };

    const handleDrawerToggle = () => {
        setDrawerOpen((prevOpen) => !prevOpen);
    };
    
    const results = rooms.filter((room) =>
        room.roomname.toLowerCase().includes(search)
    );

    return (
        <Box sx={{ padding: 4 }}>
            <CssBaseline />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={8}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Search Rooms"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSubmit}>
                                            <SearchIcon />
                                        </IconButton>
                                        <IconButton sx={{ display: { xs: 'block', sm: 'none' }}} onClick={handleDrawerToggle}>
                                            <TuneIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
                            <Box sx={{ padding: 2, width: "80vw" }}>
                                <Sorting sortType={sortType} setSortType={setSortType} />
                                <Filters appliedFilters={filters} addFilters={addFilters} />
                            </Box>
                    </Drawer>
                    {filters.length !== 0 && 
                        <Box sx={{ mt: 2 }}>
                            <FilterChips filters={filters} setFilters={setFilters} clear/>
                        </Box>
                    }
                    <Box sx={{ mt: 2 }}>
                        <ViewToggle onViewChange={setViewType}/>
                    </Box>
                    {loading && (
                        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!loading && viewType === 'grid' && <RoomsGrid rooms={filter(sort(results))} handleDelete={handleDelete}/>}
                    {!loading && viewType === 'list' && <RoomsList rooms={filter(sort(results))} handleDelete={handleDelete}/>}
                </Grid>
                <Grid item xs={12} sm={4} md={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Sorting sortType={sortType} setSortType={setSortType}/>
                    <Filters appliedFilters={filters} addFilters={addFilters}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchView;