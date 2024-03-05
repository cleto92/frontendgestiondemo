/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable quotes */
/* eslint-disable object-curly-spacing */
import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import AsignarMinorista from "../../../components/Pedidos/AsignarMinorista";
import AsignarProductos from "../../../components/Pedidos/AsignarProductos";
import Resumen from "../../../components/Pedidos/Resumen";
import PedidoContext from "../../../context/pedidosMayoristas/PedidoMayoristaContext";
import Swal from "sweetalert2";


const EDITAR_PEDIDO_INSTALACION = gql`
mutation actualizarPedidoMinorista($id: ID!, $input: PedidoMinoristaInput){
  actualizarPedidoMinorista(id: $id, input: $input){
id
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

const Editarpedidoalarma = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [mensaje, guardarMensaje] = useState(null);
  const [actualizarAlarmaPedido] = useMutation(EDITAR_PEDIDO_INSTALACION, {
    fetchPolicy: "no-cache",
  });

  const pedidoContext = useContext(PedidoContext);
  const { productos, cliente } = pedidoContext;
  const datosTransformados = (cliente, productos) => {
    const alarmas = productos.map((producto) => ({
      idAlarma: producto.id,
      cantidadAlarmas: producto.cantidad, // Asegúrate de que este campo exista y tenga el valor correcto
      nombreAlarma: producto.nombre, // Asegúrate de que este campo exista y tenga el valor correcto
    }));

    return {
      clienteId: cliente.id,
      nombreCliente: cliente.nombre,
      numeroCliente: cliente.numerocliente,
      alarmas: alarmas, // Enviar el arreglo de alarmas
    };
  };

  console.log(pid);

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-1 w-full my-1 max-w-sm text-center mx-auto'>
        <p className='text-red text-2xl'>{mensaje}</p>
      </div>
    );
  };


  const alarmapedido = async () => {
    try {
      const inputVariables = datosTransformados(cliente, productos);
      const { data } = await actualizarAlarmaPedido({
        variables: {
          id: pid,
          input: inputVariables,
        },
      });
      console.log(data);
      Swal.fire(
          'Edición realizada con exito',
          'El Pedido se creo correctamente',
          'success',
      );
      router.push('/Instalaciones');
    } catch (error) {
      guardarMensaje(error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''));
      setTimeout(() => {
        guardarMensaje(null);
      }, 5000);
    }
  };

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <div>
        <AsignarMinorista />
        <AsignarProductos />
        <Resumen />
      </div>
      <button
        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
        onClick={() => alarmapedido()}
      >
        Actualizar Instalacion
      </button>
    </Layout>
  );
};

export default Editarpedidoalarma;
