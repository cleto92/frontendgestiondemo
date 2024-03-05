/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React from 'react';

const Entrada = ({entrada}) => {
  const {proveedor, numerofactura, detalle, fecha} = entrada;

  return (
    <>
      <tr key={entrada.id}>
        <td className="border px-5 py-2 text-center">{proveedor}</td>
        <td className="border px-5 py-2 text-center">{numerofactura}</td>
        <td className="border px-5 py-2 text-center">{detalle}</td>
        <td className="border px-5 py-2 text-center">{fecha}</td>
      </tr>
    </>
  );
};

export default Entrada;
