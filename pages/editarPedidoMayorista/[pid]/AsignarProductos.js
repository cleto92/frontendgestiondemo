/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React from 'react';
import Layout from '../../../components/Layout';
import {useRouter} from 'next/router';
import {useQuery, gql} from '@apollo/client';
import AsignarProductosMayorista from '../../../components/AsignarProductosMayorista';

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

const AsignarProductos = () => {
  const router = useRouter();
  const {pid} = router.query;
  const {data, loading} = useQuery(OBTENER_PEDIDOS_ID, {
    variables: {
      id: pid,
      skip: pid,
    },
  });

  if (loading) return 'Cargando...';

  const {obtenerPedidosId} = data;

  const productosPedido = obtenerPedidosId.productos;

  return (
    <Layout>
      <div></div>
      <div>
        <AsignarProductosMayorista
          productosPedido={productosPedido}
          pedidoId={pid}
          datosPedido={obtenerPedidosId}
        />
      </div>
    </Layout>
  );
};

export default AsignarProductos;
