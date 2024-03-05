/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';

const Salida = ({salida}) => {
  const {tecnico, fecha, detalle, productos} = salida;
  const renderListaProductos = () => {
    if (productos.length === 0) {
      return <p>No hay productos</p>;
    }

    return (
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} [{producto.cantidad}]
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <tr key={salida.id}>
        <td className="border px-5 py-2 text-center">{tecnico}</td>
        <td className="border px-5 py-2 text-center">
          {renderListaProductos()}
        </td>
        <td className="border px-5 py-2 text-center">{detalle}</td>
        <td className="border px-5 py-2 text-center">{fecha}</td>
      </tr>
    </>
  );
};

export default Salida;
