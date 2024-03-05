/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useContext} from 'react';
import PedidoContext from '../../context/pedidosMayoristas/PedidoMayoristaContext';
import ProductoResumen from './ProductoResumen';

const Resumen = () => {
  const pedidoContext = useContext(PedidoContext);
  const {productos} = pedidoContext;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
        Asignar cantidad {productos.producto}
      </p>

      {productos.length > 0 ? (
        productos.map((producto) => (
          <ProductoResumen key={producto.id} producto={producto} />
        ))
      ) : (
        <p className="mt-5 text-sm">No hay productos</p>
      )}
    </>
  );
};

export default Resumen;
