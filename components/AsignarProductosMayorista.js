/* eslint-disable react/prop-types */ /* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React, {useContext} from 'react';
import {useMutation, gql} from '@apollo/client';
import AsignarProductos from './Pedidos/AsignarProductos';
import Resumen from './Pedidos/Resumen';
import PedidoContext from '../context/pedidosMayoristas/PedidoMayoristaContext';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';

const AGREGAR_PRODUCTO_A_PEDIDO = gql`
  mutation agregarProductoAPedido(
    $pedidoId: ID!
    $productoInput: PedidoProductoInput!
  ) {
    agregarProductoAPedido(pedidoId: $pedidoId, productoInput: $productoInput) {
      id
      productos {
        id
        cantidad
      }
    }
  }
`;

const AgregarProductoAPedido = ({pedidoId, datosPedido, productosPedido}) => {
  const {nombre} = datosPedido;
  const pedidoContext = useContext(PedidoContext);
  const {productos} = pedidoContext;
  const router = useRouter();

  const [agregarProductoAPedidoMutation] = useMutation(
      AGREGAR_PRODUCTO_A_PEDIDO,
      {
        fetchPolicy: 'no-cache',
      },
  );

  const agregarProductoAlPedido = async () => {
    const producto = productos.map(
        ({stock, __typename, ...producto}) => producto,
    )[0];

    try {
      const {data} = await agregarProductoAPedidoMutation({
        variables: {
          pedidoId: pedidoId,
          productoInput: producto,
        },
      });
      console.log(data);
      Swal.fire(
          'Producto Agregado con éxito',
          'El Producto se agregó correctamente al pedido',
          'success',
      );
      router.push('/Pedidos');
    } catch (error) {
      console.log(error);
      Swal.fire(
          'Error al agregar el producto al pedido',
          'Hubo un error al agregar el producto al pedido. Inténtalo nuevamente.',
          'error',
      );
    }
  };

  return (
    <div>
      <header className="font-bold uppercase text-xl mt-4">
        Agregar Producto al Pedido de:{' '}
        <span className="font-bold mt-10">{nombre}</span>
      </header>
      <div className="mt-5">
        <h1 className="text-lg font-bold mb-4">Resumen Pedido:</h1>
        <div>
          {productosPedido.map((producto) => (
            <li className="ml-2" key={producto.id}>
              {producto.nombre}:{' '}
              <span className="mr-2 font-bold">{producto.cantidad}</span>
            </li>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <AsignarProductos />
        <Resumen />
        <button
          className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
          onClick={() => agregarProductoAlPedido()}
        >
          Agregar Producto al Pedido
        </button>
      </div>
    </div>
  );
};

export default AgregarProductoAPedido;
