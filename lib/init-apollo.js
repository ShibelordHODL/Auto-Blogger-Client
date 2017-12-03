import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

const local = withClientState({
  Query: {
    foo: () => ({ bar: true }),
  },
});

const link = ApolloLink.from([
  local,
  new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cja8a9yp23kz80132nhoa4k7i', // Server URL (must be absolute)
    opts: {
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    },
  }),
]);

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: true,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
