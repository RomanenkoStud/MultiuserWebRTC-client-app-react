import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function PrivateRoute({ component: Component, ...props }) {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return isLoggedIn ? <Component {...props} /> : <Navigate to="/login" replace={true} />;
}


export default PrivateRoute;