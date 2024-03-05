/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useContext, useState} from 'react';
import Layout from '../components/Layout';
import AsignarProductos from '../components/Pedidos/AsignarProductos';
import AsignarMayorista from '../components/Pedidos/AsignarMayorista';
import Resumen from '../components/Pedidos/Resumen';
import PedidoContext from '../context/pedidosMayoristas/PedidoMayoristaContext';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_PEDIDO_MAYORISTA = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
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

const NuevoPedido = () => {
  const router = useRouter();
  const pedidoContext = useContext(PedidoContext);
  const {cliente, productos} = pedidoContext;
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO_MAYORISTA, {
    fetchPolicy: 'no-cache',
  });
  const [mensaje, guardarMensaje] = useState(null);

  const crearNuevoPedido = async () => {
    const pedido = productos.map(
        ({stock, __typename, ...producto}) => producto,
    );
    const {id, nombre, estado, fecha} = cliente;

    // Muestra el cuadro de diálogo de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres crear este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear!',
      cancelButtonText: 'No, cancelar',
    });

    // Si el usuario confirma, procede con la creación del pedido
    if (result.isConfirmed) {
      try {
        const {data} = await nuevoPedido({
          variables: {
            input: {
              cliente: id,
              productos: pedido,
              nombre: nombre,
              estado,
              fecha,
            },
          },
        });
        console.log(data);
        Swal.fire(
            'Pedido Creado con éxito',
            'Aguarde para ser redireccionado',
            'success',
        );
        setTimeout(() => {
          router.push('/Pedidos');
        }, 3000);
      } catch (error) {
        guardarMensaje(
            error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''),
        );
        setTimeout(() => {
          guardarMensaje(null);
        }, 5000);
      }
    }
  };


  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-1 w-full my-1 max-w-sm text-center mx-auto">
        <p className="font-bold bg-red-700 text-lg text-white">{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>

      <div className="flex justify-center-mt-5">
        <div className="w-full max-w-lg">
          <AsignarMayorista />
          <AsignarProductos />
          <Resumen />
          <button
            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            onClick={() => crearNuevoPedido()}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
