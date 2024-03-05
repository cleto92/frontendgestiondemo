/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React, {useContext, useState, useEffect} from 'react';
import PedidoContext from '../../context/pedidosMayoristas/PedidoMayoristaContext';

const ProductoResumen = ({producto}) => {
  const pedidoContext = useContext(PedidoContext);
  const {cantidadProductos} = pedidoContext;
  const [cantidad, setCantidad] = useState(0);
  const {nombre} = producto;
  const actualizarCantidad = () => {
    const nuevoProducto = {...producto, cantidad};
    cantidadProductos(nuevoProducto);
  };

  useEffect(() => {
    actualizarCantidad();
  }, [cantidad]);


  return (
    <div className="md:flex md:justify-between md:items-center mt-5 ">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">Cantidad {nombre}:</p>
        <p></p>
      </div>
      <input
        onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
        value={cantidad}
        type="number"
        placeholder="Cantidad"
        className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
      />
    </div>
  );
};

export default ProductoResumen;
