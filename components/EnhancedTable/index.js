import React from 'react';
import PropTypes from 'prop-types';
import {
  SortingState, SelectionState, PagingState, GroupingState,
  LocalGrouping, LocalPaging, LocalSorting, RowDetailState, EditingState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableView, TableHeaderRow, TableSelection, TableGroupRow,
  PagingPanel, GroupingPanel, DragDropContext, TableRowDetail,
  TableColumnReordering, TableEditColumn, TableEditRow
} from '@devexpress/dx-react-grid-material-ui';
import {
  AppBar, Paper, Typography, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Tabs, Tab, Divider, Chip, TableCell
} from 'material-ui';
import MuiGrid from 'material-ui/Grid';
import DoneIcon from 'material-ui-icons/Done';
import PauseIcon from 'material-ui-icons/PauseCircleOutline';
import LoopIcon from 'material-ui-icons/Loop';
import HelpIcon from 'material-ui-icons/HelpOutline';
import TurnedInIcon from 'material-ui-icons/TurnedIn';
import AccessTimeIcon from 'material-ui-icons/AccessTime'
import StyleIcon from 'material-ui-icons/Style';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {
  generateRows,
  employeeValues,
  employeeTaskValues,
} from './generator';

import Loading from '../loading';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    marginLeft: 0,
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  paragraph: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
  },
  noDataCell: {
    textAlign: 'center',
    padding: '40px 0',
  },
});
const TabContainer = ({ data, classes }) => {
  return (
    <div className={classes.margin}>
      <MuiGrid container justify="flex-start" alignItems="center" >
        <MuiGrid item>
          <Typography color="primary">
            <AccessTimeIcon />
          </Typography>
        </MuiGrid>
        <MuiGrid item>
          <Typography color="secondary" type="body2">{data.status}</Typography>
        </MuiGrid>
        <MuiGrid item>
          <Typography color="primary">
            <TurnedInIcon />
          </Typography>
        </MuiGrid>
        <MuiGrid item>
          <Typography color="secondary" type="body2">{data.status}</Typography>
        </MuiGrid>
      </MuiGrid>
      <MuiGrid container justify="flex-start" alignItems="center" >
        <MuiGrid item>
          <Typography color="primary">
            <StyleIcon />
          </Typography>
        </MuiGrid>
        <MuiGrid item>
          <MuiGrid container justify="center" wrap="wrap">
            <Chip label="Clickable Chip" className={classes.chip} color="primary" />
            <Chip label="Clickable Chip" className={classes.chip} />
            <Chip label="Clickable Chip" className={classes.chip} />
            <Chip label="Clickable Chip" className={classes.chip} />
            <Chip label="Clickable Chip" className={classes.chip} />
          </MuiGrid>
        </MuiGrid>
      </MuiGrid>
      <Divider light className={classes.divider} />
      <Typography paragraph align="justify" className={classes.paragraph}>
        {data.article}
      </Typography>
    </div >
  );
};

TabContainer.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

class GridDetailContainerBase extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, value) {
    this.setState({ value });
  }
  render() {
    const {
        value,
    } = this.state;
    const { data, classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper>
          <AppBar position="static" color="inherit">
            <Tabs
              value={value}
              onChange={this.handleChange}
              fullWidth
            >
              <Tab label="Detail" disabled={false} />
              <Tab label="Images" disabled={false} />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer data={data} classes={classes} />}
          {value === 1 && <TabContainer data={data} classes={classes} />}
        </Paper>
      </div>
    );
  }
}

GridDetailContainerBase.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const GridDetailContainer = withStyles(styles, { withTheme: true })(GridDetailContainerBase);

const NoDataCellBase = ({ loading, colSpan, classes }) => (
  <TableCell
    className={classes.noDataCell}
    colSpan={colSpan}
  >
    <big>{loading ? 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv' : 'No data'}</big>
  </TableCell>
);

NoDataCellBase.propTypes = {
  loading: PropTypes.bool.isRequired,
  colSpan: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};
const NoDataCell = withStyles(styles, { name: 'RemoteDataDemo' })(NoDataCellBase);
// eslint-disable-next-line
class EnchancedTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'title', title: 'Title' },
        {
          name: 'keywords', title: 'Category', width: 150,
          getCellValue: row => (row.keywords[0] ? row.keywords[0].keyword : '')
        },
        { name: 'status', title: 'Status', width: 150 },
        { name: 'createdDate', title: 'Created', width: 100 },
      ],
      rows: props.allArticles,
      pageSize: 3,
      currentPage: 0,
      totalCount: props.totalCount,
      allowedPageSizes: [3, 10, 15],
    };
    this.commitChanges = this.commitChanges.bind(this);
  }
  changeCurrentPage(currentPage) {
    this.setState({
      currentPage,
    });

    this.props.loadMoreArticles(currentPage, this.state.pageSize)

  }
  changePageSize(pageSize) {
    const totalPages = Math.ceil(this.state.totalCount / pageSize);
    const currentPage = Math.min(this.state.currentPage, totalPages - 1);

    this.setState({
      pageSize,
      currentPage,
    });
    this.props.loadMoreArticles(this.state.currentPage, pageSize)
  }
  commitChanges({ added, changed, deleted }) {
    let { rows } = this.state;
    if (added) {
      const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    this.setState({ rows });

  }
  render() {
    const { rows, columns, allowedPageSizes, pageSize, currentPage, totalCount } = this.state;
    const { loading, error, allArticles } = this.props
    return (
      <div style={{ position: 'relative' }}>
        <Grid
          rows={allArticles}
          columns={columns}
        >
          {/* <EditingState
            onCommitChanges={(added, changed, deleted) => this.commitChanges(added, changed, deleted)}
          /> */}
          <SortingState />
          <GroupingState />
          <PagingState
            currentPage={currentPage}
            pageSize={pageSize}
            onCurrentPageChange={currentPage => this.changeCurrentPage(currentPage)}
            onPageSizeChange={newPageSize => this.changePageSize(newPageSize)}
            totalCount={totalCount}
          />
          <RowDetailState
            defaultExpandedRows={[]}
          />

          <LocalSorting />
          <LocalGrouping />

          <SelectionState />

          <DragDropContext />

          <TableView
            tableNoDataCellTemplate={({ colSpan }) => (
              <NoDataCell loading={loading} colSpan={colSpan} />
            )}
          />

          <TableColumnReordering defaultOrder={columns.map(column => column.name)} />

          <TableHeaderRow allowSorting allowDragging />
          <PagingPanel
            allowedPageSizes={allowedPageSizes}
          />
          <TableSelection />
          <TableRowDetail
            template={({ row }) => (
              <GridDetailContainer
                data={row}
              />
            )}
          />
          <TableGroupRow />

          {/* <TableEditRow />
          <TableEditColumn
            allowAdding
            allowEditing
            allowDeleting
          /> */}
          <GroupingPanel allowSorting allowDragging />
        </Grid>
        {loading && <Loading />}
      </div>

    );
  }
}

export const allArticles = gql`
  query allArticles($first: Int!, $skip: Int!) {
    allArticles(orderBy: id_DESC, first: $first, skip: $skip) {
      id
      title
      categories{
        id
        name
      }
      images{
        id
        gSRC
      }
      keywords {
        id
        keyword
      }
    	status
    	article
    },
    _allArticlesMeta {
      count
    }
  }
`

export const allPostsQueryVars = {
  skip: 0,
  first: 3
}

export default graphql(allArticles, {
  options: {
    variables: allPostsQueryVars,
    notifyOnNetworkStatusChange: true
  },
  props: ({ data: { loading, error, allArticles, _allArticlesMeta, fetchMore } }) => ({
    loading,
    error,
    allArticles,
    fetchMore,
    totalCount: _allArticlesMeta.count,
    loadMoreArticles: (skip, first) => {
      return fetchMore({
        variables: {
          skip,
          first
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult
          }
          return { ...fetchMoreResult }
        }
      })
    }
  })
})(EnchancedTable)
