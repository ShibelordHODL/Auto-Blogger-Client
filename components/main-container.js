import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';

const drawerWidth = 240;

const styles = theme => ({
  content: {
    width: '100%',
    marginLeft: -drawerWidth,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

type Props = {
  classes: Object,
  openMenu?: string,
  children: Node,
};

function MainContainer({ classes, openMenu, children }: Props) {
  return (
    <main className={classNames(classes.content, openMenu && classes.contentShift)}>
      {children}
    </main>
  );
}

MainContainer.defaultProps = {
  openMenu: false,
};

export default withStyles(styles)(MainContainer);
