import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import DashboardIcon from 'material-ui-icons/Dashboard';
import TitleIcon from 'material-ui-icons/Title';
import SettingsIcon from 'material-ui-icons/Settings';

function MenusList() {
  return (
    <div>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <TitleIcon />
        </ListItemIcon>
        <ListItemText primary="RSS" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <TitleIcon />
        </ListItemIcon>
        <ListItemText primary="Posts" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Configs" />
      </ListItem>
    </div>
  );
}
export default MenusList;
