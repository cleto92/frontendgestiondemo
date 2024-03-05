/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {useQuery, gql} from '@apollo/client';
import Producto from '../components/Producto';
import Link from 'next/link';
import * as XLSX from 'xlsx';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      stock
      creado
      detalle
    }
  }
`;

const Productos = () => {
  const {data, loading} = useQuery(OBTENER_PRODUCTOS, {
    fetchPolicy: 'no-cache',
  });
  const [busqueda, setBusqueda] = useState('');

  if (loading) return 'Cargando...';

  const productosFiltrados = data?.obtenerProductos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
        <div className="flex justify-between items-center">
          {/* Agrupa los enlaces */}
          <div>
            <Link href="/NuevoProducto" className="bg-blue-800 py-2 px-5 mt-3 rounded inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 uppercase font-bold text-sm mr-3">
            Agregar Producto
            </Link>
            <Link href="/CrearAlarma" className="bg-blue-800 py-2 px-5 mt-3 rounded inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 uppercase font-bold text-sm ml-3">
            Agregar Alarma / Kit
            </Link>
          </div>

          {/* Botón de exportar a Excel */}
          <button
            onClick={() => exportToExcel(productosFiltrados, 'ListaDeProductos')}
            className="bg-green-700 py-2 px-5 mt-3 rounded inline-block text-white hover:bg-green-500 hover:text-gray-200 mb-3 uppercase font-bold text-sm"
          >
          Exportar a Excel
          </button>
        </div>

        <div className="my-5 w-full max-w-md rounded-xl">
          <input
            type="text"
            placeholder="Buscar Producto"
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-3">Nombre</th>
              <th className="w-1/5 py-3">Stock</th>
              <th className="w-1/5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {productosFiltrados.map((producto) => (
              <Producto key={producto.id} producto={producto} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default Productos;
