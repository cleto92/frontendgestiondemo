/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState, useMemo} from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import {gql, useQuery} from '@apollo/client';
import PedidoMinorista from '../components/PedidoMinorista';
import Paginacion from '../components/Paginacion';

const OBTENER_PEDIDOS_MINORISTAS = gql`
  query obtenerPedidosMinoritas {
    obtenerPedidosMinoritas {
      id
      productos {
        id
        cantidad
        nombre
      }
      clienteId
      nombreCliente
      numeroCliente
      alarmas {
        idAlarma
        cantidadAlarmas
        nombreAlarma
      }
      estado
      fecha
      fechaModificacion
      actualizada
      comentario
    }
  }
`;
const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
      email
      rol
    }
  }
`;

const PEDIDOS_POR_PAGINA = 5;

const Instalaciones = () => {
  const {data, loading} = useQuery(OBTENER_PEDIDOS_MINORISTAS, {
    fetchPolicy: 'no-cache',
  });
  const {data: dataUsuario} = useQuery(OBTENER_USUARIO, {
    fetchPolicy: 'no-cache',
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const handleFiltroChange = (e) => {
    setFiltroEstado(e.target.value);
    setPaginaActual(1);
  };

  const pedidosFiltradosYOrdenados = useMemo(() => {
    let filtrados = data?.obtenerPedidosMinoritas || [];
    if (filtroEstado) {
      filtrados = filtrados.filter(
          (pedido) => pedido.estado === filtroEstado.toUpperCase(),
      );
    }

    if (busqueda) {
      filtrados = filtrados.filter((pedido) =>
        pedido.numeroCliente.includes(busqueda),
      );
    }

    if (filtroEstado === 'Finalizada' && filtroEstado === 'Pendiente' && filtroEstado === 'Instalada') {
      filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

    return filtrados;
  }, [data, filtroEstado, busqueda]);

  if (loading) return 'Cargando...';

  const totalPaginas = Math.ceil(
      pedidosFiltradosYOrdenados.length / PEDIDOS_POR_PAGINA,
  );
  const indiceInicial = (paginaActual - 1) * PEDIDOS_POR_PAGINA;
  const pedidosEnPaginaActual = pedidosFiltradosYOrdenados.slice(
      indiceInicial,
      indiceInicial + PEDIDOS_POR_PAGINA,
  );

  return (
    <Layout>
      <div>
        <h1 className="uppercase text-xl font-bold">INSTALACIONES</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-start items-center gap-4">
            <Link
              className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded font-bold text-sm"
              href="/NuevaInstalacion"
            >
              Nueva Instalación
            </Link>

            <select
              value={filtroEstado}
              onChange={handleFiltroChange}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              style={{minWidth: '50px'}}
            >
              <option value="">Filtrar Instalaciones</option>
              <option value="">
                Todo
              </option>
              <option value="Pendiente">Pendiente</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Instalada">Instalada</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar por N° Cliente"
          value={busqueda}
          onChange={handleBusquedaChange}
          className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />

        {pedidosFiltradosYOrdenados.length === 0 ? (
          <p>No existen Instalaciones</p>
        ) : (
          <>
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              setPagina={setPaginaActual}
            />
            {pedidosEnPaginaActual.map((pedidoMinorista) => (
              <PedidoMinorista
                key={pedidoMinorista.id}
                pedidoMinorista={pedidoMinorista}
                dataUsuario={dataUsuario}
              />
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Instalaciones;
