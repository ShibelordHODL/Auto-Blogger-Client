import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import Head from 'next/head';
import initApollo from './init-apollo';
// import withui from './with-ui';

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown';
}

export default ComposedComponent => class WithData extends React.Component {
  static displayName = `WithData(${getComponentDisplayName(ComposedComponent)})`
  static propTypes = {
    serverState: PropTypes.object.isRequired,
  }

  static async getInitialProps(ctx) {
    // Initial serverState with apollo (empty)
    let serverState = { apollo: {} };

    // Evaluate the composed component's getInitialProps()
    let composedInitialProps = {};
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx);
    }

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    if (!process.browser) {
      const apollo = initApollo();
      // Provide the `url` prop data in case a GraphQL query uses it
      const url = { query: ctx.query, pathname: ctx.pathname };
      try {
        // Run all GraphQL queries
        await getDataFromTree(<ApolloProvider client={apollo}>
          <withui>
            <ComposedComponent url={url} {...composedInitialProps} />
          </withui>
        </ApolloProvider>, );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
      }
      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();

      // Extract query data from the Apollo store
      serverState = {
        apollo: {
          data: apollo.cache.extract(),
        },
      };
    }

    return {
      serverState,
      ...composedInitialProps,
    };
  }

  constructor(props) {
    super(props);
    this.apollo = initApollo(this.props.serverState.apollo.data);
  }

  render() {
    return (
      <ApolloProvider client={this.apollo}>
        {/* <withui> */}
        <ComposedComponent {...this.props} />
        {/* </withui> */}
      </ApolloProvider>
    );
  }
};
