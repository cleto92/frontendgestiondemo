/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useContext, useState} from 'react';
import Swal from 'sweetalert2';
import AsignarMinorista from '../components/Pedidos/AsignarMinorista';
import AsignarProductos from '../components/Pedidos/AsignarProductos';
import Resumen from '../components/Pedidos/Resumen';
import Layout from '../components/Layout';
import {gql, useMutation} from '@apollo/client';
import PedidoContext from '../context/pedidosMayoristas/PedidoMayoristaContext';
import {useRouter} from 'next/router';

const NUEVO_PEDIDO_MINORISTA = gql `
mutation crearPedidoMinorista($input: PedidoMinoristaInput) {
  crearPedidoMinorista(input: $input) {
	clienteId
    nombreCliente
    numeroCliente
    alarmas {
      idAlarma
      cantidadAlarmas
      nombreAlarma
    }
    
  }
}
`;

const NuevaInstalacion = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const [nuevaAlarmaPedido] = useMutation(NUEVO_PEDIDO_MINORISTA, {
    fetchPolicy: 'no-cache',
  });

  const router = useRouter();

  const pedidoContext = useContext(PedidoContext);
  const {cliente, productos} = pedidoContext;

  const transformarDatosParaMutation = (cliente, productos) => {
    const alarmas = productos.map((producto) => ({
      idAlarma: producto.id,
      cantidadAlarmas: producto.cantidad,
      nombreAlarma: producto.nombre,
    }));

    return {
      clienteId: cliente.id,
      nombreCliente: cliente.nombre,
      numeroCliente: cliente.numerocliente,
      alarmas: alarmas,
    };
  };

  console.log(transformarDatosParaMutation);

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p className="font-bold">{mensaje}</p>
      </div>
    );
  };

  const crearpedidominorista = async () => {
    try {
      const inputVariables = transformarDatosParaMutation(cliente, productos);

      await nuevaAlarmaPedido({
        variables: {
          input: inputVariables,
        },
      });
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar la nueva Instalacion?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No, cancelar',
      });

      if (result.isConfirmed) {
        setTimeout(() => {
          router.push('/Instalaciones');
        }, 3000);
      }
    } catch (error) {
      guardarMensaje(error.message.replace('GraphQL error: ', ''));
      setTimeout(() => {
        guardarMensaje(null);
      }, 3000);
    }
  };

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <div>
        <AsignarMinorista />
        <AsignarProductos />
        <Resumen />
        <button
          type="button"
          className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
          onClick={() => crearpedidominorista()}
        >
          Registrar Pedido
        </button>
      </div>
    </Layout>
  );
};

export default NuevaInstalacion;
