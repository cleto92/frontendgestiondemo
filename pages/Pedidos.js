/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState, useMemo} from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import {gql, useQuery} from '@apollo/client';
import Pedido from '../components/Pedido';
import Paginacion from '../components/Paginacion';

const OBTENER_PEDIDOS_MAYORISTAS = gql`
  query obtenerPedidos {
    obtenerPedidos {
      id
      productos {
        id
        cantidad
        nombre
      }
      cliente
      nombre
      fechaModificacion
      fecha
      estado
    }
  }
`;

const PEDIDOS_POR_PAGINA = 5;

const Pedidos = () => {
  const {data, loading, error} = useQuery(OBTENER_PEDIDOS_MAYORISTAS, {
    fetchPolicy: 'no-cache',
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  const PedidosOrdenadosPorFecha = useMemo(() => {
    if (!data) return [];
    return [...data.obtenerPedidos].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha),
    );
  }, [data]);


  const PedidosFiltrados = useMemo(() => {
    return busqueda ?
      PedidosOrdenadosPorFecha.filter((pedido) =>
        pedido.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ) :
      PedidosOrdenadosPorFecha;
  }, [busqueda, PedidosOrdenadosPorFecha]);

  const totalPaginas = Math.ceil(PedidosFiltrados.length / PEDIDOS_POR_PAGINA);
  const indiceInicial = (paginaActual - 1) * PEDIDOS_POR_PAGINA;
  const pedidosEnPaginaActual = PedidosFiltrados.slice(
      indiceInicial,
      indiceInicial + PEDIDOS_POR_PAGINA,
  );

  if (loading) return 'Cargando...';
  if (error) return `Error! ${error.message}`;

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">PEDIDOS</h1>
      <Link className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded font-bold text-sm" href="/NuevoPedido">Nuevo Pedido
      </Link>
      <input
        type="text"
        placeholder="Buscar Cliente Mayorista"
        value={busqueda}
        onChange={handleBusquedaChange}
        className="my-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        setPagina={setPaginaActual}
      />
      {pedidosEnPaginaActual.map((pedido) => (
        <Pedido key={pedido.id} pedido={pedido} />
      ))}

    </Layout>
  );
};

export default Pedidos;
