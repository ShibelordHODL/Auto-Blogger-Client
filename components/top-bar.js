// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import MenuIcon from 'material-ui-icons/Menu';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

type Props = {
  classes: Object,
  openMenu: boolean,
  toggleMenu: Function,
};

function TopBar({ classes, openMenu, toggleMenu }: Props) {
  return (
    <AppBar className={classNames(classes.appBar, openMenu && classes.appBarShift)}>
      <Toolbar disableGutters={!openMenu}>
        <IconButton
          color="contrast"
          aria-label="open drawer"
          onClick={toggleMenu}
          className={classNames(classes.menuButton, openMenu && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <Typography type="title" color="inherit" noWrap>
          Auto Blogger V 1.0
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(TopBar);
