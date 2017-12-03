import React, { Component } from 'react';

import PageWithMenu from '../components/page-with-menu';

import withRoot from '../components/withRoot';


const styles = theme => ({});

class Home extends Component {
  static async getInitialProps({ req }) {
    if (req) {
      // eslint-disable-next-line global-require
      const utils = require('../lib/utils');
      // const aaa = await utils.postArticle("cjanj8epwou460192ysxpyv8n", "cjanvkd2k1we9011131mltg23")
      // console.log(aaa)


    }
    return { res: {} };
  }

  componentDidMount() {
    // this.props.dispatch(startClock())
  }

  render() {
    return <PageWithMenu>sssss</PageWithMenu>;
  }
}

export default withRoot(Home);
