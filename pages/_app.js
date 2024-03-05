/* eslint-disable linebreak-style */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import {ApolloProvider} from '@apollo/client';
import client from '../config/apollo';
import {SidebarProvider} from '../components/SideBarContext';
import PedidoMayoristaState from '../context/pedidosMayoristas/PedidoMayoristaState';
import 'semantic-ui-css/semantic.min.css';


const MyApp = ({Component, pageProps}) => {
  return (
    <ApolloProvider client={client}>
      <SidebarProvider>
        <PedidoMayoristaState>
          <Component {...pageProps} />
        </PedidoMayoristaState>
      </SidebarProvider>
    </ApolloProvider>
  );
};

export default MyApp;
