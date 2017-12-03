import React from 'react';

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import List from 'material-ui/List';

import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

import { withStyles } from 'material-ui/styles';

import MenusList from '../components/menus';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

type Props = {
  classes: Object,
  theme: Object,
  openMenu: string,
  toggleMenu: Function,
};

function SideMenu({
  classes, theme, openMenu, toggleMenu,
}: Props) {
  return (
    <Drawer
      type="persistent"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={openMenu}
    >
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleMenu}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>
          <MenusList />
        </List>
        <Divider />
        <List className={classes.list} />
      </div>
    </Drawer>
  );
}
export default withStyles(styles, { withTheme: true })(SideMenu);
