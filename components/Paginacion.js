/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React from 'react';

const Paginador = ({paginaActual, totalPaginas, setPagina}) => {
  return (
    <div className="flex justify-between items-center my-4">
      <button
        className={`px-4 py-2 rounded text-white ${
          paginaActual === 1 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={() => setPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        Anterior
      </button>
      <div className="flex space-x-1">
        {[...Array(totalPaginas).keys()].map((numero) => (
          <button
            key={numero}
            className={`px-3 py-1 rounded ${
              paginaActual === numero + 1 ?
                'bg-blue-500 text-white' :
                'bg-gray-200'
            }`}
            onClick={() => setPagina(numero + 1)}
          >
            {numero + 1}
          </button>
        ))}
      </div>

      <button
        className={`px-4 py-2 rounded text-white ${
          paginaActual === totalPaginas ?
            'bg-gray-400' :
            'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={() => setPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paginador;
