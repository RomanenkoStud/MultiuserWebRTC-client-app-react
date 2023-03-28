import { useState, useEffect, useContext } from 'react';
import {AppBar, Box, Toolbar, IconButton} from '@mui/material';
import {Menu, MenuItem} from '@mui/material';
import {Drawer, Divider} from '@mui/material';
import {List, ListItem, ListItemIcon, ListItemText, ListItemButton} from '@mui/material';
import RoomConnectIcon from '../../icons/RoomConnectIcon';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import MoreIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import { LogoAnimationContext } from './LogoAnimationContext';
import { useLogoAnimation } from '../../hooks/useLogoAnimation';

export default function NavBar({currentUser, logOut}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const { logoAnimationState, setLogoAnimationState } = useContext(LogoAnimationContext);
    const { navigate } = useLogoAnimation();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    useEffect(() => {
        if (logoAnimationState) {
            setTimeout(() => {
                setLogoAnimationState(false);
            }, 3000);
        }
    }, [logoAnimationState, setLogoAnimationState]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
    
        setDrawerOpen(open);
    };

    const drawerItem = (text, icon, page) => (
        <ListItem key={text} disablePadding onClick={() => {navigate(page)}}>
            <ListItemButton>
                <ListItemIcon>
                {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
            </ListItem>
    );

    const renderDrawerItems = (
        <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        >
        <List>
            {drawerItem("Home", <HomeIcon/>, "/")}
            {drawerItem("Profile", <AccountCircle/>, "/")}
            {drawerItem("Profile", <AccountCircle/>, "/")}
        </List>
        <Divider />
        <List>
            {drawerItem("Home", <HomeIcon/>, "/")}
            {drawerItem("Profile", <AccountCircle/>, "/")}
            {drawerItem("Profile", <AccountCircle/>, "/")}
        </List>
    </Box>
    );

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        >
        {currentUser && <MenuItem onClick={handleMenuClose}>Profile</MenuItem>}
        {currentUser && 
        <MenuItem onClick={() => {
                handleMenuClose();
                logOut();}}> 
            LogOut
        </MenuItem>}
        {!currentUser &&
        <MenuItem onClick={() => {
            handleMenuClose();
            navigate("/login/");}}>
            Login
        </MenuItem>}
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        >
        <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            >
            <AccountCircle />
            </IconButton>
            <p>Profile</p>
        </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={()=>setDrawerOpen(true)}
                sx={{mr: 2}}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
            anchor={'left'}
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
            >
                {renderDrawerItems}
            </Drawer>
            <RoomConnectIcon 
                animation={logoAnimationState} 
                style={{ width: '150px', height: '50px' }} 
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {currentUser ? (
                    <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    >
                        <AccountCircle />
                    </IconButton> 
                ) : (
                    <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => {navigate("/login/")}}
                    >
                        <LoginIcon />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                >
                <MoreIcon />
                </IconButton>
            </Box>
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        </Box>
    );
}