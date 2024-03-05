/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidosMayoristas/PedidoMayoristaContext';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      stock
    }
  }
`;

const AsignarProductos = () => {
  const [productos, setProductos] = useState([]);
  const pedidoContext = useContext(PedidoContext);
  const { agregarProducto } = pedidoContext;

  const { data, loading } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    agregarProducto(productos);
  }, [productos]);

  const seleccionarProducto = (producto) => {
    setProductos(producto);
  };

  if (loading) return null;

  const { obtenerProductos } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
        Asignar Producto
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        onChange={(opciones) => seleccionarProducto(opciones)}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `${opciones.nombre} - ${opciones.stock} Disponibles`
        }
        isMulti={true}
        placeholder="Buscar Producto"
        noOptionsMessage={() => 'No Hay Resultado'}
      />
    </>
  );
};

export default AsignarProductos;
