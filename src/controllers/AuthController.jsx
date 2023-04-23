import isEmail from 'validator/lib/isEmail';
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/slices/authSlice";
import authService from "../services/auth.service";
import { createContext } from 'react';

export const AuthContext = createContext();

export default function AuthController({ children }) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

    return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
        {children}
    </AuthContext.Provider>
    );
}