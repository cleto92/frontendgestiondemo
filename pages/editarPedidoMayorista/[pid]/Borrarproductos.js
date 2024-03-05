/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../../../components/Layout';
import {gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import BorrarProductosMayorista from '../../../components/BorrarProductosMayorista';

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

const Borrarproductos = () => {
  const router = useRouter();
  const {pid} = router.query;
  const {data, loading} = useQuery(OBTENER_PEDIDOS_ID, {
    variables: {
      id: pid,
      skip: !pid,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) return 'Cargando...';

  const {obtenerPedidosId} = data;
  const productosPedido = obtenerPedidosId.productos;
  console.log(pid);

  return (
    <>
      <Layout>
        <BorrarProductosMayorista
          productosPedido={productosPedido}
          pedidoId={pid}
        />
      </Layout>
    </>
  );
};

export default Borrarproductos;
