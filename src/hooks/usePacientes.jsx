import { useContext } from 'react';
import PacientesContext from '../context/PacientesProvider';


const usePacientes = () => {
    return useContext(PacientesContext); // hace disponible los valores del provider
}

export default usePacientes;