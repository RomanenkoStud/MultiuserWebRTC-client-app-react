import { Route, Routes } from 'react-router-dom';
import ProfileView from "../views/ProfileView";
import RegisterView from "../views/RegisterView";
import { useSelector, useDispatch } from "react-redux";
import isEmail from 'validator/lib/isEmail';
import userService from "../services/user.service";
import PrivateRoute from "../components/PrivateRoute";
import { update, logout } from "../store/slices/authSlice";


const UserController = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleRegister = (userNew, setError, setMessage) => {
        const validateUsername = userNew.username.length >= 8 ? false : true;
        const validateEmail = !isEmail(userNew.email);
        const validatePassword = userNew.password.length >= 8 ? false : true;
        setError({username: validateUsername, email: validateEmail, password: validatePassword});
        if (!validateUsername && !validateEmail && !validatePassword) {
            setMessage({
                successful: false,
                message: "Please wait...",
                loading: true
            });
            userService
                .register(userNew)
                .then(
                    (response) => {
                        setMessage({
                            message: "Thanks for registration " + userNew.username + "!",
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
                        console.log(error.response.data);
                    }
                );
        };
    };

    const handleUpdate = (userUpdated, setError, setMessage) => {
        const validateUsername = userUpdated.username.length >= 8 ? false : true;
        const validateEmail = !isEmail(userUpdated.email);
        const validatePassword = userUpdated.password.length >= 8 ? false : true;
        const validateConfirmPassword = 
            userUpdated.confirmPassword === userUpdated.password ? false : true;
        setError({
            username: validateUsername, 
            email: validateEmail, 
            password: validatePassword,
            confirmPassword: validateConfirmPassword
        });
        if (!validateUsername && !validateEmail && !validatePassword) {
            setMessage({
                successful: false,
                message: "Please wait...",
                loading: true
            });
            userService
                .update({...userUpdated, id: user.id, token: user.token})
                .then(
                    (response) => {
                        setMessage({
                            message: "Successful!",
                            successful: true,
                            loading: false
                        });
                        dispatch(update(userUpdated));
                    },
                    (error) => {
                        setMessage({
                            successful: false,
                            message: error.response,
                            loading: false
                        });
                    }
                );
        };
    };

    const handleDelete = () => {
        userService
            .delete(user)
            .then(
                (response) => {
                    dispatch(logout());
                },
                (error) => {
                    
                }
            );
    };
    
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute component={ProfileView} 
                user={user} 
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />} />
            <Route path="/register" element={<RegisterView handleRegister={handleRegister} />} />
        </Routes>
    );
};

export default UserController;