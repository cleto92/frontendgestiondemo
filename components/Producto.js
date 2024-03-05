/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import Swal from 'sweetalert2';
import {gql, useMutation} from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;

const Producto = ({producto}) => {
  const [eliminar] = useMutation(ELIMINAR_PRODUCTO, {
    fetchPolicy: 'no-cache',
  });


  const {nombre, stock, id, detalle} = producto;
  const editarProducto = () => {
    Router.push({
      pathname: '/editarproducto/[id]',
      query: {id},
    });
  };
  const eliminarProducto = () => {
    Swal.fire({
      title: '¿Eliminar Producto?',
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
          const {data} = await eliminar({
            variables: {
              id,
            },
          });
          Swal.fire('Producto Eliminado', data.eliminar, 'success');
          setTimeout(() => {
            Router.reload('/Productos'); ;
          }, 3000);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <>
      <tr>
        <td className="border px-4 py-2 font-bold uppercase">{nombre}
          <li className="text-xs">
            {detalle}
          </li>
        </td>
        <td className="border px-4 py-2 font-bold uppercase">{stock}</td>
        <td className="border px-4 py-2 font-bold uppercase">
          <button
            type="button"
            className="flex justify-center items-center bg-red-800 py-2 px-2 w-full text-white rounded text-base uppercase font-bold"
            onClick={() => eliminarProducto()}
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
            onClick={() => editarProducto()}
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
    </>
  );
};

export default Producto;
