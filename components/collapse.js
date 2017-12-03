import React, { Component } from 'react';
import type { Node } from 'react';
import classnames from 'classnames';
import { CardActions } from 'material-ui/Card';
import MuiCollapse from 'material-ui/transitions/Collapse';
import IconButton from 'material-ui/IconButton';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});

type State = {
  open: boolean,
};

type Props = {
  classes: Object,
  title: Node,
  children: Node,
};

class Collapse extends Component<Props, State> {
  state = {
    open: false,
  };
  toggle = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    const { classes, title, children } = this.props;
    const { open } = this.state;
    return (
      <div>
        <CardActions disableActionSpacing>
          {title}
          {/* <div className={classes.flexGrow} /> */}
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: open,
            })}
            onClick={this.toggle}
            aria-expanded={open}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <MuiCollapse in={open}>{children}</MuiCollapse>
      </div>
    );
  }
}

export default withStyles(styles)(Collapse);
