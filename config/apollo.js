/* eslint-disable linebreak-style */
import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from 'apollo-link-context';

const HttpLink = createHttpLink({
  uri: 'https://backendgestiondemo-56c971be8b74.herokuapp.com/',
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(HttpLink),
});

export default client;
