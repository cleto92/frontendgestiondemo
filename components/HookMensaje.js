/* eslint-disable linebreak-style */
/* eslint-disable max-len */
// eslint-disable-next-line linebreak-style
import {useState} from 'react';

export const useMensaje = () => {
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (error) => {
    if (error) {
      const formattedMessage = error.message.replace('ApolloError: ', '', 'GraphQL error: ', '');
      setMensaje(formattedMessage);
    }
  };

  return {mensaje, mostrarMensaje};
};

export default useMensaje;
