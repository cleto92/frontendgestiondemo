/* eslint-disable linebreak-style */
/* eslint-disable max-len */

import React, {useState, useEffect, useContext} from 'react';
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client';
import PedidoContext from '../../context/pedidosMayoristas/PedidoMayoristaContext';

const OBTENER_CLIENTES = gql`
  query obtenerClientesMayoristas {
    obtenerClienteMayorista {
      id
      nombre
      apellido
      email
      movil
      empresa
    }
  }
`;

const AsignarMayorista = () => {
  const [cliente, setCliente] = useState([]);

  // Context de Pedido

  const pedidoContext = useContext(PedidoContext);
  const {agregarClienteMayorista} = pedidoContext;

  const {data, loading, error} = useQuery(OBTENER_CLIENTES);
  console.log(data);
  console.log(loading);
  console.log(error);

  useEffect(() => {
    agregarClienteMayorista(cliente);
  }, [cliente]);

  const seleccionarCliente = (cliente) => {
    setCliente(cliente);
  };

  if (loading) return null;

  const {obtenerClienteMayorista} = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
        Asignar Cliente al Pedido
      </p>
      <Select
        className="mt-3"
        options={obtenerClienteMayorista}
        onChange={(opciones) => seleccionarCliente(opciones)}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) => opciones.nombre}
        placeholder="Buscar Cliente"
        noOptionsMessage={() => 'No Hay Resultado'}
      />
    </>
  );
};

export default AsignarMayorista;
