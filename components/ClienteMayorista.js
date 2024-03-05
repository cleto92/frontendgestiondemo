/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
// eslint-disable-next-line no-trailing-spaces
/* eslint-disable react/prop-types */ /* eslint-disable linebreak-style */
import React from 'react';
import Swal from 'sweetalert2';
import {gql, useMutation} from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE_MAYORISTA = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

const OBTENER_CLIENTES_MAYORISTAS = gql`
  query obtenerClientesMayoristas {
    obtenerClienteMayorista {
      id
      nombre
      apellido
      email
      empresa
      movil
    }
  }
`;

const ClienteMayorista = ({ClienteMayorista}) => {
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE_MAYORISTA, {
    update(cache) {
      const {obtenerClienteMayorista} = cache.readQuery({
        query: OBTENER_CLIENTES_MAYORISTAS,
      });
      cache.writeQuery({
        query: OBTENER_CLIENTES_MAYORISTAS,
        data: {
          obtenerClientesMayoristas: obtenerClienteMayorista.filter(
              (clienteActual) => clienteActual.id !== id,
          ),
        },
      });
    },
  });

  const {
    nombre,
    apellido,
    email,
    telefono,
    movil,
    provincia,
    localidad,
    direccion,
    empresa,
    id,
  } = ClienteMayorista;
  const eliminarClienteId = () => {
    Swal.fire({
      title: '¿Eliminar Cliente?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const {data} = await eliminarCliente({
            variables: {
              id,
            },
          });
          console.log(data);
          Swal.fire('Eliminado', data.eliminarCliente, 'success');
          Router.push('/ClientesMayoristas');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarCliente = () => {
    Router.push({
      pathname: '/editarmayorista/[id]',
      query: {id},
    });
  };

  return (
    <tr>
      <td className="font-bold border px-5 py-2 text-center">
        {nombre} {apellido}
      </td>
      <td className="font-bold border px-5 py-2 text-center">
        {email} - {movil}
      </td>
      <td className="font-bold border px-5 py-2 text-center">{empresa}</td>
      <td className="font-bold border px-5 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-base uppercase font-bold"
          onClick={() => eliminarClienteId(id)}
        >
          Eliminar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="flex justify-center items-center mt-4 bg-green-600 py-2 px-4 w-full text-white rounded text-base uppercase font-bold"
          onClick={() => editarCliente()}
        >
          EDITAR
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default ClienteMayorista;
