/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React from 'react';
import {useQuery, gql} from '@apollo/client';
import {useRouter} from 'next/router';

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
      email
      rol
    }
  }
`;

const Header = () => {
  const router = useRouter();

  const {data, loading} = useQuery(OBTENER_USUARIO);

  if (loading) {
    return 'Cargando...';
  }

  if (!data) {
    return router.push('/Login');
  }

  const {nombre} = data.obtenerUsuario;
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/Login');
  };

  return (
    <div className="flex justify-between mb-6">
      <p className="mr-2 font-bold">Hola: {nombre}</p>
      <button
        className="bg-blue-800 w-full sm:w-auto
        font-bold uppercase text-xs
        rounded py-1 px-2 text-white shadow-sm"
        type="button"
        onClick={() => cerrarSesion()}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
