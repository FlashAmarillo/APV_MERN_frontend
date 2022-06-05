import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';


const useAuth = () => {
    return useContext(AuthContext); // hace disponible los valores del provider
}

export default useAuth;