import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import PageWithMenu from '../components/page-with-menu'
import EnchancedTable from '../components/EnhancedTable'

import withData from '../lib/with-data';
import withRoot from '../components/withRoot';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
})

class Posts extends Component {

  render() {
    return (
      <PageWithMenu>
        <Paper elevation={4}>
          <EnchancedTable />
        </Paper>
      </PageWithMenu>
    )
  }
}

Posts.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRoot(withData(withStyles(styles)(Posts)))
