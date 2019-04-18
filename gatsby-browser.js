import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from './src/client';
import { List } from './src/components/list';

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);

// const ApolloApp = (AppComponent) => (
//   <ApolloProvider client={client}>
//     <AppComponent />
//   </ApolloProvider>
// );

// ReactDOM.render(ApolloApp(List), document.getElementById("___gatsby"));