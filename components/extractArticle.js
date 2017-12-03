// @flow
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  formControl: {
    marginBottom: theme.spacing.unit,
  },
  spacer: {
    marginTop: theme.spacing.unit * 3,
  },
});

type Props = {
  classes: Object,
  fetchHTML: Function,
  extractArticle: Function,
  url: string,
};
type State = {
  +url: string,
  article: string,
};

class ExtractArticle extends Component<Props, State> {
  state = {
    url: '',
    article: '',
  };

  defaultProps = {
    url: 'ssssss',
  };

  changeState = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  submitURL = async () => {
    console.log('dddddddddddddddddddddd');
    const { url } = this.state;
    // eslint-disable-next-line global-require
    const utils = require('../lib/utils');
    const res = await this.props.fetchHTML(url);
    const cleanHTML = await utils.cleanPageHTML(res);
    const BBCode = await utils.HtmlToBBCode(cleanHTML);
    const extractData = await this.props.extractArticle(BBCode);
    this.setState({ article: extractData.article });
  };

  render() {
    const { classes } = this.props;
    const { url, article } = this.state;
    return (
      <div>
        <TextField
          label="URL"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          margin="normal"
          value={url}
          onChange={this.changeState('url')}
        />
        <Button raised color="primary" onChange={this.submitURL}>
          Submit
        </Button>
        <Paper className={classes.root}>
          <div className={classes.spacer} />
        </Paper>
      </div>
    );
  }
}

const FETCH_HTML_QUERY = gql`
  query fetchHTMLQuery($url: String!) {
    fetchHTML(url: $url) {
      html
    }
  }
`;

// const AYLIEN_EXTRACT_QUERY = gql`
//   query aylienExtractQuery($html: String!) {
//     aylienExtract(html: $html) {
//       title
//       tags
//       article
//     }
//   }
// `;

// const extractArticleWithGraphQL = compose(
//   (graphql(FETCH_HTML_QUERY, {
//     name: 'fetchHTML',
//     props: ({ data }) => ({
//       data,
//     }),
//   }): Function),
//   (graphql(AYLIEN_EXTRACT_QUERY, {
//     name: 'extractArticle',
//   }): Function),
// )(ExtractArticle);

// const CREATE_POST_MUTATION = gql`
//   mutation CreatePostMutation($description: String!, $imageUrl: String!) {
//     createPost(description: $description, imageUrl: $imageUrl) {
//       id
//       description
//       imageUrl
//     }
//   }
// `;

// const query = gql`
//   query users($id: Int!) {
//     users(id: $id) {
//       id
//       name
//     }
//   }
// `;

const ListPageWithQuery = graphql(FETCH_HTML_QUERY, {
  name: 'fetchHTML',
  props: ({
    fetchHTML,
    // `client` is provided by the `withApollo` HOC
    ownProps: { client },
  }) => ({
    // `signin` is the name of the prop passed to the component
    signin: (event) => {
      /* global FormData */
      const data = new FormData(event);

      event.preventDefault();
      event.stopPropagation();

      fetchHTML({
        variables: {
          url: data,
        },
      })
        .then(({ data: { signinUser: { token } } }) => {
          // // Store the token in cookie
          // document.cookie = cookie.serialize('token', token, {
          //   maxAge: 30 * 24 * 60 * 60, // 30 days
          // });
          // // Force a reload of all the current queries now that the user is
          // // logged in
          // client.resetStore().then(() => {
          //   // Now redirect to the homepage
          //   redirect({}, '/');
          // });
        })
        .catch((error) => {
          // Something went wrong, such as incorrect password, or no network
          // available, etc.
          console.error(error);
        });
    },
  }),
  variables: {
    url: '',
  },
})(ExtractArticle);

export default withStyles(styles)(ListPageWithQuery);
