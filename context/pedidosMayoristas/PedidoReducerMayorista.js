/* eslint-disable linebreak-style */
import {
  SELECCIONAR_CLIENTE_MAYORISTA,
  SELECCIONAR_PRODUCTO_MAYORISTA,
  CANTIDAD_PRODUCTO,
} from '../../types';

const pedidoReducerMayorista = (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTE_MAYORISTA:
      return {
        ...state,
        cliente: action.payload,
      };
    case SELECCIONAR_PRODUCTO_MAYORISTA:
      return {
        ...state,
        productos: action.payload,
      };

    case CANTIDAD_PRODUCTO:
      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.id === action.payload.id ?
            (producto = action.payload) :
            producto,
        ),
      };

    default:
      return state;
  }
};

export default pedidoReducerMayorista;
