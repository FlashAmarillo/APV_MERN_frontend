import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // nos permite leer los parametros de la URL, en nuestro caso el token
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";

const ConfirmarCuenta = () => {

    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [alerta, setAlerta] = useState({});


    const params = useParams();
    const { id } = params;

    // mandamos el token una vez que el componente este listo, por eso usamos useEffect para hacer esta peticion
    useEffect(() => {
      const validarCuenta = async () => {
        try {
          const url = `/veterinarios/confirmar/${id}`; // url del endpoint
          const { data } = await clienteAxios(url);
          setCuentaConfirmada(true);
          setAlerta({
            msg: data.msg
          })
        } catch (error) {
          setAlerta({
            msg: error.response.data.msg,
            error: true
          });
        }

        setCargando(false);
      }
      validarCuenta();
    }, []) //se ejecuta una sola vez una vez el componente este listo
    


    return (
      <>
          <div>
            <h1 className="text-indigo-600 font-black text-4xl md:text-6xl">Confirma tu cuenta y Comienza a Administrar {""}<span className="text-black">tus Pacientes</span></h1>
        </div>

        <div className="mt-8 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
            {!cargando && 
              <Alerta 
                alerta={alerta}
              />}

            {cuentaConfirmada && (
              <Link className="block text-center my-5 text-gray-500" to="/">Iniciar Sesión</Link>
            )}
        </div>
      </>
    )
  }
  
  export default ConfirmarCuenta;