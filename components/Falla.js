/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';

const Falla = ({falla}) => {
  const {productos, detalle, fecha} = falla;
  return (
    <>
      <tr key={falla.id}>
        <td className="border px-5 py-2 text-center">{productos[0]?.nombre}</td>
        <td className="border px-5 py-2 text-center">
          {productos[0]?.cantidad}
        </td>
        <td className="border px-5 py-2 text-center">{detalle}</td>
        <td className="border px-5 py-2 text-center">{fecha}</td>
      </tr>
    </>
  );
};

export default Falla;
