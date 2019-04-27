import ApolloClient from 'apollo-boost';
import fetch from 'isomorphic-fetch';

export const client = new ApolloClient({
  uri: 'https://api-euwest.graphcms.com/v1/cjumpzpoz199401erp05lzn3z/master?query=',
  fetch,
});