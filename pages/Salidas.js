/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState, useMemo} from 'react';
import Layout from '../components/Layout';
import {useQuery, gql} from '@apollo/client';
import Link from 'next/link';
import Paginacion from '../components/Paginacion';
import Salida from '../components/Salida';

const NUEVA_SALIDA = gql`
  query obtenerSalidas {
    obtenerSalidas {
      tecnico
      fecha
      detalle
      tipo
      productos {
        id
        cantidad
        nombre
      }
    }
  }
`;

const SALIDAS_PAGINA = 25;

const Salidas = () => {
  const {data, loading} = useQuery(NUEVA_SALIDA, {
    fetchPolicy: 'no-cache',
  });
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const salidasFiltradasYOrdenadas = useMemo(() => {
    let filtradas = data?.obtenerSalidas || [];
    if (busqueda) {
      filtradas = filtradas.filter((salida) =>
        salida.tecnico.toLowerCase().includes(busqueda.toLowerCase()),
      );
    }
    // Aquí se mantiene la ordenación por fecha más reciente
    return filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data, busqueda]);

  if (loading) return 'Cargando';

  // Se calcula el total de páginas basado en las salidas filtradas y ordenadas
  const totalPaginas = Math.ceil(
      salidasFiltradasYOrdenadas.length / SALIDAS_PAGINA,
  );
  const indiceFinal = paginaActual * SALIDAS_PAGINA;
  const indiceInicial = indiceFinal - SALIDAS_PAGINA;
  // Se utilizan las salidas filtradas y ordenadas para la paginación actual
  const salidasEnPaginaActual = salidasFiltradasYOrdenadas.slice(
      indiceInicial,
      indiceFinal,
  );

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Salidas</h1>
        <Link className="bg-blue-800 py-2 px-5 mt-3 rounded inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 uppercase font-bold text-sm mr-3" href="/CrearSalida"> Agregar Salida
        </Link>
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPagina={setPaginaActual}
        />
        <input
          type="text"
          placeholder="Buscar Técnico"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="shadow appearance-none border rounded-xl w-2/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <table className="table-auto shadow-md mt-5 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/6 py-2">Técnico</th>
              <th className="w-1/6 py-2">Productos</th>
              <th className="w-1/6 py-2">Detalle</th>
              <th className="w-1/6 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {salidasEnPaginaActual.map((salida) => (
              <Salida key={salida.id} salida={salida} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default Salidas;
