/* eslint-disable react/prop-types */ /* eslint-disable linebreak-style */
import React from 'react';
import {useMutation, gql} from '@apollo/client';
import {FaTrash} from 'react-icons/fa';
import {useRouter} from 'next/router';

const ELIMINAR_PRODUCTO_PEDIDO = gql`
  mutation EliminarProductoDePedido($pedidoId: ID!, $productoId: ID!) {
    eliminarProductoDePedido(pedidoId: $pedidoId, productoId: $productoId) {
      id
      productos {
        id
        nombre
        cantidad
      }
    }
  }
`;

const BorrarProductos = ({productosPedido, pedidoId}) => {
  const router = useRouter();
  const [eliminarProductoDePedido] = useMutation(ELIMINAR_PRODUCTO_PEDIDO);

  const eliminar = async (productoId) => {
    try {
      await eliminarProductoDePedido({
        variables: {
          pedidoId,
          productoId,
        },
      });
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {productosPedido.length ? (
          productosPedido.map((producto) => (
            <div key={producto.id} className="border-t pt-4 mb-4">
              <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 mb-4">
                Cantidad: {producto.cantidad}{' '}
              </p>
              <button
                onClick={() => eliminar(producto.id)}
                className="bg-red-800 py-2 px-4 rounded font-bold
                 text-white shadow mb-4"
              >
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos en este pedido.</p>
        )}
      </div>
    </div>
  );
};

export default BorrarProductos;
