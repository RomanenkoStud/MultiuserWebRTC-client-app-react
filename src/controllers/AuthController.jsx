import isEmail from 'validator/lib/isEmail';
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/slices/authSlice";
import authService from "../services/auth.service";
import { createContext, useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import SessionExpiredModal from "../components/SessionExpired";

export const AuthContext = createContext();

export default function AuthController({ children }) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user = useSelector((state) => state.auth.user);
    const [sessionExpired, setSessionExpired] = useState(false);

    const handleLogin = (user, setError, setMessage) => {
        const validateEmail = !isEmail(user.email);
        const validatePassword = user.password.length >= 8 ? false : true;
        setError({email: validateEmail, password: validatePassword});
        if (!validateEmail && !validatePassword) {
            setMessage({
            successful: false,
            message: 'Please wait...',
            loading: true,
            });
            authService.login(user).then(
            (response) => {
                setMessage({
                message: 'Wellcome ' + response.data.username + '!',
                successful: true,
                loading: false,
                });
                dispatch(login(response.data));
            },
            (error) => {
                setMessage({
                successful: false,
                message: error.response.data,
                loading: false,
                });
            }
            );
        }
    };

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
    };

    useEffect(() => {
        // check for token expiration on page load
        if (isLoggedIn) {
            const token = user.token;
            const decodedToken = jwtDecode(token);
            const tokenExpiration = decodedToken.exp * 1000;
            const currentTime = Date.now();
            if (currentTime > tokenExpiration) {
                setSessionExpired(true);
            } else {
                setSessionExpired(false);
            }
        }
    }, [isLoggedIn, user]);
    
    const handleSessionExpired = () => {
        setSessionExpired(false);
        handleLogout();
    };

    return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
        {children}
        <SessionExpiredModal sessionExpired={sessionExpired} handleSessionExpired={handleSessionExpired}/>
    </AuthContext.Provider>
    );
}