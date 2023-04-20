import { Route, Routes } from 'react-router-dom';
import ProfileView from "../views/ProfileView";
import RegisterView from "../views/RegisterView";
import { useSelector } from "react-redux";
import isEmail from 'validator/lib/isEmail';
import userService from "../services/user.service";
import PrivateRoute from "../components/PrivateRoute";


const UserController = () => {
    const user = useSelector((state) => state.auth.user);

    const handleRegister = (
            username, setUsernameError, 
            email, setEmailError, 
            password, setPasswordError,
            setMessage
        ) => {
        const validateUsername = username.length >= 8 ? false : true;
        const validateEmail = !isEmail(email);
        const validatePassword = password.length >= 8 ? false : true;
        setUsernameError(validateUsername);
        setEmailError(validateEmail);
        setPasswordError(validatePassword);
        if (!validateUsername && !validateEmail && !validatePassword) {
            setMessage({
                successful: false,
                message: "Please wait...",
                loading: true
            });
            userService
                .register(username, email, password)
                .then(
                    (response) => {
                        setMessage({
                            message: "Thanks for registration " + username + "!",
                            successful: true,
                            loading: false
                        });
                    },
                    (error) => {
                        setMessage({
                            successful: false,
                            message: error.response.data,
                            loading: false
                        });
                    }
                );
        };
        };
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute component={ProfileView} user={user}/>} />
            <Route path="/register" element={<RegisterView handleRegister={handleRegister} />} />
        </Routes>
    );
};

export default UserController;