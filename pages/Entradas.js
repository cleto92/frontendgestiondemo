/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useState, useMemo} from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import {useQuery, gql} from '@apollo/client';
import Paginacion from '../components/Paginacion';
import Entrada from '../components/Entrada';

const OBTENER_ENTRADAS = gql`
  query obtenerEntradas {
    obtenerEntradas {
      proveedor
      numerofactura
      detalle
      tipo
      fecha
    }
  }
`;

const ENTRADAS_PAGINA = 25;

const Entradas = () => {
  const [busqueda, setBusqueda] = useState('');
  const {data, loading} = useQuery(OBTENER_ENTRADAS, {
    fetchPolicy: 'no-cache',
  });

  const entradasOrdenadas = useMemo(() => {
    const entradas = data?.obtenerEntradas || [];
    return entradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data]);

  const entradasFiltradas = useMemo(() => {
    return busqueda ?
      entradasOrdenadas.filter((entrada) =>
        entrada.proveedor.toLowerCase().includes(busqueda.toLowerCase()),
      ) :
      entradasOrdenadas;
  }, [entradasOrdenadas, busqueda]);

  const [paginaActual, setPaginaActual] = useState(1);

  if (loading) return 'Cargando';

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const {obtenerEntradas} = data;
  const totalPaginas = Math.ceil(obtenerEntradas.length / ENTRADAS_PAGINA);
  const indiceFinal = paginaActual * ENTRADAS_PAGINA;
  const indiceInicial = indiceFinal - ENTRADAS_PAGINA;
  const pedidosEnPaginaActual = obtenerEntradas.slice(
      indiceInicial,
      indiceFinal,
  );

  console.log(obtenerEntradas);

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Entradas</h1>
        <Link className="bg-blue-800 py-2 px-5 mt-3 rounded inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3  uppercase font-bold text-sm mr-3" href="/CrearEntrada"> Agregar Entrada
        </Link>
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPagina={setPaginaActual}
        />

        <table className="table-auto shadow-md mt-5 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/6 py-2">Proveedor</th>
              <th className="w-1/6 py-2">N° Factura</th>
              <th className="w-1/6 py-2">Detalle</th>
              <th className="w-1/6 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.obtenerEntradas
                .slice(
                    (paginaActual - 1) * ENTRADAS_PAGINA,
                    paginaActual * ENTRADAS_PAGINA,
                )
                .map((entrada) => (
                  <Entrada key={entrada.id} entrada={entrada} />
                ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default Entradas;
