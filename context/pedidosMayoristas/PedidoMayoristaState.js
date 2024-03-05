/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useReducer} from 'react';
import PedidoContext from './PedidoMayoristaContext';
import PedidoReducerMayorista from './PedidoReducerMayorista';

import {
  SELECCIONAR_CLIENTE_MAYORISTA,
  SELECCIONAR_PRODUCTO_MAYORISTA,
  CANTIDAD_PRODUCTO,
} from '../../types';

const PedidoMayoristaState = ({children}) => {
  // State de Pedidos
  const initialState = {
    cliente: {},
    productos: [],
  };

  const [state, dispatch] = useReducer(PedidoReducerMayorista, initialState);

  const agregarClienteMayorista = (clienteMayorista) => {
    dispatch({
      type: SELECCIONAR_CLIENTE_MAYORISTA,
      payload: clienteMayorista,
    });
  };

  const agregarProducto = (productosSeleccionados) => {
    let nuevoState;
    if (state.productos.length > 0) {
      nuevoState = productosSeleccionados.map((producto) => {
        const nuevoObjeto = state.productos.find(
            (productoState) => productoState.id === producto.id,
        );
        return {...producto, ...nuevoObjeto};
      });
    } else {
      nuevoState = productosSeleccionados;
    }

    dispatch({
      type: SELECCIONAR_PRODUCTO_MAYORISTA,
      payload: nuevoState,
    });
  };

  const cantidadProductos = (nuevoProducto) => {
    console.log(nuevoProducto);
    dispatch({
      type: CANTIDAD_PRODUCTO,
      payload: nuevoProducto,
    });
  };

  return (
    <PedidoContext.Provider
      value={{
        agregarProducto,
        agregarClienteMayorista,
        productos: state.productos,
        cantidadProductos,
        cliente: state.cliente,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoMayoristaState;
