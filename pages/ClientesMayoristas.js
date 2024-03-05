/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/Layout';
import {gql, useQuery} from '@apollo/client';
import Link from 'next/link';
import Cliente from '../components/ClienteMayorista';
import Paginacion from '../components/Paginacion';
import {useState, useMemo} from 'react';

const OBTENER_CLIENTES = gql`
  query obtenerClientesMayoristas {
    obtenerClienteMayorista {
      id
      nombre
      apellido
      email
      empresa
      fecha
      movil
    }
  }
`;

const CLIENTES_POR_PAGINA = 5;

const ClientesMayoristas = () => {
  const {data, loading} = useQuery(OBTENER_CLIENTES, {
    fetchPolicy: 'no-cache',
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  const clientesOrdenadosPorFecha = useMemo(() => {
    if (!data) return [];

    return [...data.obtenerClienteMayorista].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha),
    );
  }, [data]);

  const clientesFiltrados = useMemo(() => {
    return busqueda ?
      clientesOrdenadosPorFecha.filter((cliente) =>
        cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()),
      ) :
      clientesOrdenadosPorFecha;
  }, [busqueda, clientesOrdenadosPorFecha]);

  const totalPaginas = Math.ceil(
      clientesFiltrados.length / CLIENTES_POR_PAGINA,
  );
  const indiceFinal = paginaActual * CLIENTES_POR_PAGINA;
  const indiceInicial = indiceFinal - CLIENTES_POR_PAGINA;
  const clientesEnPaginaActual = clientesFiltrados.slice(
      indiceInicial,
      indiceFinal,
  );

  if (loading) return 'Cargando...';

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">
          CLIENTES MAYORISTAS
        </h1>
        <Link className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold" href="/NuevoClienteMayorista">Nuevo Cliente Mayorista</Link>
        <div className="my-5 w-full max-w-md rounded-xl">
          <input
            type="text"
            placeholder="Buscar Cliente Mayorista"
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            setPagina={setPaginaActual}
          />
        </div>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-3">Nombre y Apellido</th>
              <th className="w-1/5 py-3">Email / Movil</th>
              <th className="w-1/5 py-3">Empresa</th>
              <th className="w-1/5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {clientesEnPaginaActual.map((ClienteMayorista) => (
              <Cliente
                key={ClienteMayorista.id}
                ClienteMayorista={ClienteMayorista}
              />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default ClientesMayoristas;
