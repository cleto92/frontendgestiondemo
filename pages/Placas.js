/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState, useMemo} from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import PlacasClientes from '../components/PlacasClientes';
import {gql, useQuery} from '@apollo/client';
import Paginacion from '../components/Paginacion';

const OBTENER_PLACAS_CLIENTES = gql`
  query obtenerReparacion {
    obtenerReparacion {
      id
      numerocliente
      detalle
      tecnico
      fecha
      componente
      estado
      observaciones
    }
  }
`;

const OBJETOS_POR_PAGINA = 5;

const Placas = () => {
  const {data, loading} = useQuery(OBTENER_PLACAS_CLIENTES, {
    fetchPolicy: 'no-cache',
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  // Función para manejar los cambios en el input de búsqueda
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1); // Volver a la primera página cuando se realice una nueva búsqueda
  };

  // useMemo para ordenar las reparaciones por fecha
  const reparacionesOrdenadas = useMemo(() => {
    const reparaciones = data?.obtenerReparacion || [];
    return reparaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data]);

  // useMemo para filtrar las reparaciones por número de cliente
  const reparacionesFiltradas = useMemo(() => {
    return busqueda ?
      reparacionesOrdenadas.filter((reparacion) =>
        reparacion.numerocliente.toString().includes(busqueda),
      ) :
      reparacionesOrdenadas;
  }, [reparacionesOrdenadas, busqueda]);

  if (loading) return 'Cargando..';

  const totalPaginas = Math.ceil(
      reparacionesFiltradas.length / OBJETOS_POR_PAGINA,
  );
  const indiceInicial = (paginaActual - 1) * OBJETOS_POR_PAGINA;
  const reparacionesEnPaginaActual = reparacionesFiltradas.slice(
      indiceInicial,
      indiceInicial + OBJETOS_POR_PAGINA,
  );

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Reparaciones Placas Clientes
      </h1>
      <Link className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold" href="/NuevaReparacion">Agregar Placa
      </Link>
      <input
        type="text"
        placeholder="Buscar Placa Cliente por Número de Cliente"
        value={busqueda}
        onChange={handleBusquedaChange}
        className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {reparacionesFiltradas.length === 0 ? (
        <p>No existen Reparaciones</p>
      ) : (
        <>
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            setPagina={setPaginaActual}
          />
          <table className="table-auto shadow-md mt-5 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/6 py-2">Tecnico</th>
                <th className="w-1/6 py-2">Numero de Cliente</th>
                <th className="w-1/6 py-2">Componente</th>
                <th className="w-1/6 py-2">Desperfecto</th>
                <th className="w-1/6 py-2">Observacion</th>
                <th className="w-1/6 py-2">Fecha</th>
                <th className="w-1/6 py-2">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {reparacionesEnPaginaActual.map((reparacion) => (
                <PlacasClientes key={reparacion.id} reparacion={reparacion} />
              ))}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
};

export default Placas;
