import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/axios';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [cargando, setCargando] = useState(true);
    const [ auth, setAuth] = useState({});

    useEffect(() => {
      const autenticarUsuario = async () => {
          const token = localStorage.getItem('token');

          if(!token) {
              setCargando(false);
              return
          }

          const config = {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              }
          }

          try {
              const { data } = await clienteAxios('/veterinarios/perfil', config);

              setAuth(data);

          } catch (error) {
              console.log(error.response.data.msg);
              setAuth({});
          }


          setCargando(false);
      }
      autenticarUsuario();
    }, [])

    //funcion para cerrar la sesion, borrando el token de la sesion
    const cerrarSesion = () => {
        //vaciamos el LS
        localStorage.removeItem('token');
        
        //vaciamos el objeto con los datos de la sesion
        setAuth({});
    }

    // funcion para actualizar perfil
    const actualizarPerfil = async datos => {
        //configuracion para le peticion
        const token = localStorage.getItem('token');
        if(!token) {
            setCargando(false);
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        // realizacion de la peticion
        try {
            const url = `/veterinarios/perfil/${datos._id}`;
            const { data } = await clienteAxios.put(url, datos, config)
            return {
                msg: 'Almacenado correctamente'
            }
            
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }

    }

    // funcion para actualizar la contraseña en la  ruta privada
    const guardarPassword = async (datos) => {
        //configuracion para le peticion
        const token = localStorage.getItem('token');
        if(!token) {
            setCargando(false);
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        // peticion para actualizar el password en la DB
        try {
            const url = '/veterinarios/actualizar-password';

            const { data } = await clienteAxios.put(url, datos, config);

            return {
                msg: data.msg
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }

    }
    
    
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth, 
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider // este contiene los datos
}

export default AuthContext;