import { useState, useEffect, useContext } from 'react';
import {
    AppBar, 
    Box, 
    Toolbar, 
    IconButton,
    Menu, 
    MenuItem, 
    Drawer, 
    Divider,
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    ListItemButton,
    Typography,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Menu as MenuIcon,
    AccountCircle,
    Login as LoginIcon,
    Logout as LogoutIcon,
    MoreVert as MoreIcon,
    Home as HomeIcon,
    Search as SearchIcon,
    VideocamOutlined as VideocamOutlinedIcon,
    Link as LinkIcon,
    Tune as TuneIcon,
} from '@mui/icons-material';
import RoomConnectIcon from '../../icons/RoomConnectIcon';
import { LogoAnimationContext } from './LogoAnimationContext';
import { useLogoAnimation } from '../../hooks/useLogoAnimation';
import LinkWithLogoAnimation from "./LinkWithLogoAnimation";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitch from "../ThemeSwitch";

export default function NavBar() {
    const { isLoggedIn, handleLogout } = useAuth();
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

    const drawerItem = (text, icon, onClick) => (
        <ListItem key={text} disablePadding onClick={onClick}>
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
                {drawerItem("Home", <HomeIcon/>, () => {navigate("/")})}
                {drawerItem("Search", <SearchIcon/>, () => {navigate("/rooms")})}
            </List>
            <Divider />
            <List>
                {isLoggedIn && <> 
                    {drawerItem("My rooms", <DashboardIcon/>, () => {navigate("/rooms/user")})}
                    {drawerItem("Create room", <VideocamOutlinedIcon/>, () => {navigate("/rooms/create")})}
                </>}
                {drawerItem("Connect to room", <LinkIcon/>, () => {navigate("/rooms/connect")})}
                {drawerItem("Settings", <TuneIcon/>, () => {navigate("/settings")})}
                {isLoggedIn ? <>
                    {drawerItem("Profile", <AccountCircle/>, () => {navigate("/user")})}
                    {drawerItem("LogOut", <LogoutIcon/>, 
                    () => {
                        handleLogout();
                        navigate("/login");
                    })}
                    </>
                : <>
                    {drawerItem("SignUp", <AccountCircle/>, () => {navigate("/user/register")})}
                    {drawerItem("LogIn", <LoginIcon/>, () => {navigate("/login")})}
                </>}
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
        {isLoggedIn && <MenuItem onClick={() => {
                handleMenuClose();
                navigate("/user");}}>
            Profile</MenuItem>}
        {isLoggedIn && 
        <MenuItem onClick={() => {
                handleMenuClose();
                handleLogout();
                navigate("/login");}}> 
            LogOut
        </MenuItem>}
        {!isLoggedIn &&
        <MenuItem onClick={() => {
            handleMenuClose();
            navigate("/login");}}>
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
                <Box 
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    position: 'fixed',
                    bottom: 20,
                }}>
                    <ThemeSwitch/>
                    <Typography>Dark mode</Typography>
                </Box>
            </Drawer>
            <LinkWithLogoAnimation to={"/"} style={{ textDecoration: 'none' }}>
            <RoomConnectIcon 
                animation={logoAnimationState} 
                style={{ width: '150px', height: '50px' }} 
            />
            </LinkWithLogoAnimation>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center'  }}>
                <ThemeSwitch/>
                {isLoggedIn ? (
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
                    onClick={() => {navigate("/login")}}
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