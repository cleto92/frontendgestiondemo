/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useContext} from 'react';
import Layout from '../../../components/Layout';
import AsignarProductos from '../../../components/Pedidos/AsignarProductos';
import Resumen from '../../../components/Pedidos/Resumen';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import PedidoContext from '../../../context/pedidosMayoristas/PedidoMayoristaContext';

const ASINGAR_PRODUCTOS_INSTALACION = gql`
  mutation agregarProductoPedidoMinorista(
    $id: ID!
    $input: PedidoMinoristaInput
  ) {
    agregarProductoPedidoMinorista(id: $id, input: $input) {
      id
      productos {
        id
        cantidad
        nombre
      }
    }
  }
`;

const Agregarproductosalarma = () => {
  const router = useRouter();
  const {pid} = router.query;
  const pedidoContext = useContext(PedidoContext);
  const {productos} = pedidoContext;
  const [agregarProductoAlarmaPedido] = useMutation(
      ASINGAR_PRODUCTOS_INSTALACION,
      {
        fetchPolicy: 'no-cache',
      },
  );

  const pedido = productos.map(
      ({stock, __typename, ...producto}) => producto,
  );

  const productosPedido = async () => {
    console.log(pedido);
    try {
      const {data} = await agregarProductoAlarmaPedido({
        variables: {
          id: pid,
          input: {
            productos: pedido,
          },
        },
      });
      console.log(data);
      router.push('/Instalaciones');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="font-bold uppercase">
          Agregar Productos a la Instalacion:
        </h1>
        <div className="">
          <AsignarProductos />
          <Resumen />
        </div>
        <button
          className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
          onClick={() => productosPedido()}
        >
          Asignar Productos
        </button>
      </div>
    </Layout>
  );
};

export default Agregarproductosalarma;
