// @flow
import React from 'react';
import { CircularProgress } from 'material-ui';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  shading: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, .3)"
  },
  icon: {
    position: "absolute",
    fontSize: "20px",
    top: "calc(45% - 10px)",
    left: "calc(45% - 10px)",
  },
  spacer: {
    marginTop: theme.spacing.unit * 3,
  },
});

function Loading({ classes }) {
  return (
    <div className={classes.shading}>
      <CircularProgress className={classes.icon} />
    </div>
  );
}

export default withStyles(styles)(Loading);
