/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React from 'react';
import Layout from '../../../components/Layout';
import {useRouter} from 'next/router';
import {useQuery, gql} from '@apollo/client';
import EditarPedidoMayorista from '../../../components/EditarPedidoMayorista';


const OBTENER_PEDIDOS_ID = gql`
query obtenerPedidosId($id: ID!) {
  obtenerPedidosId(id: $id) {
    id
    cliente
    nombre
    productos {
      id
      cantidad
      nombre
    }
  }
}
`;


const EditarPedidos = () => {
  const router = useRouter();
  const {pid} = router.query;
  const {data, loading} = useQuery(OBTENER_PEDIDOS_ID, {
    variables: {
      id: pid,
      skip: pid,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) return 'Cargando...';

  console.log(data);

  const {obtenerPedidosId} = data;
  const productosPedido = obtenerPedidosId.productos;

  return (

    <Layout>
      <div>
        <EditarPedidoMayorista productosPedido={productosPedido} pedidoId={pid} datosPedido={obtenerPedidosId} />
      </div>

    </Layout>

  );
};

export default EditarPedidos;
