/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

const FallaComponente = ({falla}) => {
  const {productos, detalle, fecha, tecnico, numerocliente} = falla;
  return (
    <>
      <tr key={falla.id}>
        <td className="border px-5 py-2 text-center">{productos}</td>
        <td className="border px-5 py-2 text-center">{numerocliente}</td>
        <td className="border px-5 py-2 text-center">{tecnico}</td>
        <td className="border px-5 py-2 text-center">{detalle}</td>
        <td className="border px-5 py-2 text-center">{fecha}</td>
      </tr>
    </>
  );
};

export default FallaComponente;
