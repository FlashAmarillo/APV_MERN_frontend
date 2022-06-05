import { createContext, useState, useEffect } from "react";
import clienteAxios from '../config/axios';

const PacientesContext = createContext();

export const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState({}); // state con la info del paciente para EDITAR

    useEffect(() => {
      const obtenerPacientes = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios('/pacientes', config);

            setPacientes(data);

        } catch (error) {
            console.log(error);
        }
      }

      obtenerPacientes();
    }, [])
    

    const guardarPaciente = async (paciente) => {
        
        const token = localStorage.getItem('token');
        // request con la configuracion que tenga la autenticacion
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if(paciente.id) {
            try {
                // Edicion de un registro
                // Peticion para actualizar en la DB los datos del paciente
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config);

                const pacientesActualizados = pacientes.map( pacienteState => pacienteState._id === data._id ? data : pacienteState)

                setPacientes(pacientesActualizados)

            } catch (error) {
                console.log(error);
            }
        } else {
            // Nuevo Registro
            //hacemos un llamado con el paciente para almacenarlo
            try {
                const { data } = await clienteAxios.post('/pacientes', paciente, config);

                const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data;
                setPacientes([pacienteAlmacenado, ...pacientes]);
            } catch (error) {
                console.log(error.response.data.msg);
            }
        }

    }

    const setEdicion = (paciente) => {
        setPaciente(paciente);
    }

    const eliminarPaciente = async (paciente) => {

        const { _id } = paciente;

        const confirmar = confirm('¿Seguro que quiere eliminar este paciente?')
        
        if(confirmar) {
            try {
                const token = localStorage.getItem('token');
                // request con la configuracion que tenga la autenticacion
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

               const { data } = await clienteAxios.delete(`/pacientes/${_id}`, config);
               
               // actualizamos el state de los pacientes

               const pacientesActualizados = pacientes.filter( pacienteState => pacienteState._id !== _id);
    
                setPacientes(pacientesActualizados)
            } catch (error) {
                console.log(error.response.data.msg);
            }
        }
    }
    
    return (
        <PacientesContext.Provider
            value={{
                pacientes,
                paciente,
                guardarPaciente,
                setEdicion,
                eliminarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )
}

export default PacientesContext

