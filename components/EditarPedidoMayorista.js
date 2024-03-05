/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React, {useContext} from 'react';
import {useMutation, gql} from '@apollo/client';
import AsignarProductos from './Pedidos/AsignarProductos';
import Resumen from './Pedidos/Resumen';
import PedidoContext from '../context/pedidosMayoristas/PedidoMayoristaContext';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';

const ACTUALIZAR_PEDIDO = gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      id
      productos {
        id
        cantidad
      }
      cliente
      fecha
      estado
      nombre
    }
  }
`;

const EditarPedidoMayorista = ({productosPedido, pedidoId, datosPedido}) => {
  const {nombre, cliente} = datosPedido;
  const pedidoContext = useContext(PedidoContext);
  const {productos} = pedidoContext;
  const router = useRouter();

  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO, {
    fetchPolicy: 'no-cache',
  });

  const actualizarPedidoMayorista = async () => {
    const pedido = productos.map(
        ({stock, __typename, ...producto}) => producto,
    );

    try {
      const {data} = await actualizarPedido({
        variables: {
          id: pedidoId,
          input: {
            productos: pedido,
            cliente,
          },
        },
      });

      console.log(data);
      Swal.fire(
          'Pedido Actualizado con éxito',
          'El Pedido se actualizó correctamente',
          'success',
      );
      router.push('/Pedidos');
    } catch (error) {
      console.log(error);
      Swal.fire(
          'Error al actualizar el pedido',
          'Hubo un error al actualizar el pedido. Inténtalo nuevamente.',
          'error',
      );
    }
  };

  return (
    <div>
      <header className="font-bold uppercase text-xl">
        Editar Pedido: <span className="font-bold mb-10">{nombre}</span>
      </header>

      <div className="mt-10">
        <p className="font-bold text-xl uppercase">Pedido Actual:</p>
        <div>
          {productosPedido.map((producto) => (
            <li key={producto.id} className="mb-2">
              {producto.nombre}
              <span className="ml-2">{producto.cantidad}</span>
            </li>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <AsignarProductos />
        <Resumen />
        <button
          className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
          onClick={() => actualizarPedidoMayorista()}
        >
          Actualizar Pedido
        </button>
      </div>
    </div>
  );
};

export default EditarPedidoMayorista;
