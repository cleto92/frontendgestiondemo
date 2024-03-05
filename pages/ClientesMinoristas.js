/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/Layout';
import {gql, useQuery} from '@apollo/client';
import Link from 'next/link';
import ClienteMinorista from '../components/ClienteMinorista';
import Paginacion from '../components/Paginacion';
import {useState, useMemo} from 'react';

// Asegúrate de que la propiedad de fecha se incluya en la consulta GraphQL
const OBTENER_CLIENTES_MINORISTAS = gql`
  query obtenerClienteMinorista {
    obtenerClienteMinorista {
      id
      nombre
      apellido
      email
      movil
      localidad
      direccion
      numerocliente
      fecha
    }
  }
`;

const CLIENTES_POR_PAGINA = 5;

const ClientesMinoristas = () => {
  const {data, loading} = useQuery(OBTENER_CLIENTES_MINORISTAS, {
    fetchPolicy: 'no-cache',
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');

  const clientesOrdenados = useMemo(() => {
    const clientes = data?.obtenerClienteMinorista || [];

    return clientes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data]);

  const clientesFiltrados = useMemo(() => {
    if (!busqueda) return clientesOrdenados;
    const filtrados = clientesOrdenados.filter((cliente) =>
      cliente.numerocliente.toString().includes(busqueda),
    );
    console.log('Clientes después de filtrar:', filtrados);
    return filtrados;
  }, [clientesOrdenados, busqueda]);

  const totalPaginas = Math.ceil(
      clientesFiltrados.length / CLIENTES_POR_PAGINA,
  );
  const indiceInicial = (paginaActual - 1) * CLIENTES_POR_PAGINA;
  const clientesEnPaginaActual = clientesFiltrados.slice(
      indiceInicial,
      indiceInicial + CLIENTES_POR_PAGINA,
  );

  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPaginaActual(1);
  };

  if (loading) return 'Cargando...';

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">
          CLIENTES MINORISTAS
        </h1>
        <Link className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold" href="/NuevoClienteMinorista">Nuevo Cliente Minorista
        </Link>
        <input
          type="text"
          placeholder="Buscar Cliente por N° de Cliente"
          className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleBusquedaChange}
        />
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPagina={setPaginaActual}
        />
        <table className="table-auto shadow-md mt-5 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-3">Nombre y Apellido</th>
              <th className="w-1/5 py-3">Telefono / Movil</th>
              <th className="w-1/5 py-3">Localidad</th>
              <th className="w-1/5 py-4">Direccion</th>
              <th className="w-1/5 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {clientesEnPaginaActual.map((minorista) => (
              <ClienteMinorista key={minorista.id} minorista={minorista} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default ClientesMinoristas;
