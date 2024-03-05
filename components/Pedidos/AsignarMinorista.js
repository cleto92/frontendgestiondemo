/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */

import React, {useState, useEffect, useContext} from 'react';
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client';
import PedidoContext from '../../context/pedidosMayoristas/PedidoMayoristaContext';

const OBTENER_CLIENTES = gql `
query obtenerClienteMinorista{
  obtenerClienteMinorista{
id
numerocliente
nombre
apellido
email
movil
localidad
direccion

  }
}
`;


const AsignarMayorista = () => {
  const [cliente, setCliente] = useState([]);

  const pedidoContext = useContext(PedidoContext);
  const {agregarClienteMayorista} = pedidoContext;

  const {data, loading, error} = useQuery(OBTENER_CLIENTES, {
    fetchPolicy: 'no-cache',
  });
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

  const {obtenerClienteMinorista} = data;


  return (
    <>

      <p className='mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800'>Asignar Cliente  al Pedido</p>
      <Select
        className='mt-3'
        options={obtenerClienteMinorista}
        onChange={(opciones) => seleccionarCliente(opciones) }
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) => `${opciones.nombre} [${opciones.numerocliente}]`}
        placeholder= 'Buscar Cliente'
        noOptionsMessage={() => 'No Hay Resultado'}
      />

    </>
  );
};

export default AsignarMayorista;
