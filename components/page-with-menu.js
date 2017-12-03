// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { withStyles } from 'material-ui/styles';

import TopBar from './top-bar';
import SideMenu from './side-menu';
import MainContainer from './main-container';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100vh',
    zIndex: 1,
    overflowY: 'scroll',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

type State = {
  openMenu: boolean,
};

type Props = {
  classes: Object,
  children: Node,
};

class PageWithMenu extends Component<Props, State> {
  state = {
    openMenu: false,
  };
  toggleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };
  render() {
    const { classes, children } = this.props;
    const { openMenu } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <TopBar openMenu={openMenu} toggleMenu={this.toggleMenu} />
          <SideMenu openMenu={openMenu} toggleMenu={this.toggleMenu} />
          <MainContainer openMenu={openMenu} className={classes.container}>
            <div className={classes.formControl}>{children}</div>
          </MainContainer>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(PageWithMenu);
