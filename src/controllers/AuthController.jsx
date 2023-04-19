import isEmail from 'validator/lib/isEmail';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import authService from "../services/auth.service";
import { logout } from "../store/slices/authSlice";
import { createContext } from 'react';

export const AuthContext = createContext();

export default function AuthController({ children }) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const handleLogin = (email, password, setEmailError, setPasswordError, setMessage) => {
    const validateEmail = !isEmail(email);
    const validatePassword = password.length >= 8 ? false : true;
    setEmailError(validateEmail);
    setPasswordError(validatePassword);
    if (!validateEmail && !validatePassword) {
        setMessage({
        successful: false,
        message: 'Please wait...',
        loading: true,
        });
        authService.login(email, password).then(
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

    return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
        {children}
    </AuthContext.Provider>
    );
}