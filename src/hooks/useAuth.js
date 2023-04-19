import { useContext } from 'react';
import { AuthContext } from '../controllers/AuthController';

export const useAuth = () => {
    return useContext(AuthContext);
};