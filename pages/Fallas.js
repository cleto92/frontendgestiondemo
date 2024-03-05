/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState, useMemo} from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import {gql, useQuery} from '@apollo/client';
import Falla from '../components/Falla';
import Paginacion from '../components/Paginacion';

const OBTENER_FALLAS = gql`
  query obtenerFallas {
    obtenerFallas {
      productos {
        id
        cantidad
        nombre
      }
      id
      detalle
      fecha
    }
  }
`;

const OBJETOS_POR_PAGINA = 25;

const Fallas = () => {
  const {data, loading} = useQuery(OBTENER_FALLAS, {
    fetchPolicy: 'no-cache',
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const fallasOrdenadas = useMemo(() => {
    const fallas = data?.obtenerFallas || [];
    return fallas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data]);

  const fallasFiltradas = useMemo(() => {
    if (!busqueda) return fallasOrdenadas;
    return fallasOrdenadas.filter((falla) =>
      falla.productos.some((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    );
  }, [fallasOrdenadas, busqueda]);

  if (loading) return 'Cargando...';

  const totalPaginas = Math.ceil(fallasFiltradas.length / OBJETOS_POR_PAGINA);
  const indiceInicial = (paginaActual - 1) * OBJETOS_POR_PAGINA;
  const fallasEnPaginaActual = fallasFiltradas.slice(
      indiceInicial,
      indiceInicial + OBJETOS_POR_PAGINA,
  );

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Control de Fallas</h1>
      <Link className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold" href="/NuevaFalla">Agregar Falla
      </Link>
      <input
        type="text"
        placeholder="Buscar Falla por Nombre de Producto"
        value={busqueda}
        onChange={handleBusquedaChange}
        className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {fallasFiltradas.length === 0 ? (
        <p>No existen fallas de productos</p>
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
                <th className="w-1/6 py-2">Nombre</th>
                <th className="w-1/6 py-2">Cantidad</th>
                <th className="w-1/6 py-2">Detalle</th>
                <th className="w-1/6 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {fallasEnPaginaActual.map((falla) => (
                <Falla key={falla.id} falla={falla} />
              ))}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
};

export default Fallas;
