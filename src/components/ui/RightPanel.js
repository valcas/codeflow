import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from 'material-ui/Typography';
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose';
import {connect} from 'react-redux'
import store from '../redux/CodeflowStore';
import FileStore from '../file/FileStore';
import List, { ListItem, ListItemText } from 'material-ui/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import filterImage from '../../images/filter.svg';
import filterRemoveImage from '../../images/filter-remove.svg';

const {app, dialog} = window.require('electron').remote;
const drawerWidth = 300;

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 3630,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  appbar:  {
      height:48
  },
  toolbar: theme.mixins.toolbar,
});

class RightPanel extends PureComponent {

  constructor(props)  {
    super(props);
    this.id = 0;
    this.props = props;

    this.state = {selectedresponse : null};
    this.handleResponseChange = this.handleResponseChange.bind(this);

  }

  handleResponseChange(event)  {
    this.setState({selectedresponse : event.target.value});
  }

  getDataField(data, name)  {
    if (this.props.activegraph.graph.selectedresponse != null && data.length > parseInt(this.props.activegraph.graph.selectedresponse)) {
      var value = data[this.props.activegraph.graph.selectedresponse][name];
      return value;
    }
  }

  filterHandler(processid) {
    if (processid)  {
      store.dispatch({type: 'FILTER_PROCESS', payload:{processid:processid}});
    }
  }

  removeFilterHandler(processid) {
    if (processid)  {
      store.dispatch({type: 'REMOVE_FILTER'});
    }
  }

  createData(id, name, calories, fat, carbs, protein) {
    return { id, name, calories, fat, carbs, protein };
  }

  handleRowClick(index)  {
    // this.setState({selectedresponseindex : index});
    store.dispatch({type: 'SET_SELECTED_RESPONSE', payload:index});
  }

  formatDate(date)  {
    if (date == null) {
      return null;
    } else {
      var tempDate = new Date(+date);
      return tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds() + ":" + tempDate.getMilliseconds();
      // return (new Date(+date)).toLocaleTimeString();
    }
  }

  render()  {

    const { classes } = this.props;

    var data = []
    if (this.props.activegraph.graph.data && this.props.selectedstep)  {
      data = this.props.activegraph.graph.filterdata[this.props.selectedstep];
    }

    var processId = this.getDataField(data, 'processid');

    const data2 = [
      this.createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
      this.createData(2, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
      // createData('Eclair', 262, 16.0, 24, 6.0),
      // createData('Cupcake', 305, 3.7, 67, 4.3),
      // createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    var renderInfo = {};
    renderInfo.filtericon = 'small-icon' + ((processId && ( ! this.props.activegraph.graph.currentfilter)) ? '' : ' icon-disabled');
    renderInfo.removefiltericon = 'small-icon' + ((processId && this.props.activegraph.graph.currentfilter) ? '' : ' icon-disabled');

    return(
      <div className="right-panel">
        <Drawer variant="permanent" classes={{paper: classes.drawerPaper}}>
          <AppBar className={classes.appbar} position="static" color="default">
            <Toolbar>
            </Toolbar>
          </AppBar>
          <div>
            <div className="info-container">
              <div className="info-prompt">Codeflow ID:</div>
              <div className="info-data">{this.props.selectedstep}</div>
            </div>
            <Paper className={classes.root}>
              <div className="right-table-container">
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <CustomTableCell>Request</CustomTableCell>
                      <CustomTableCell numeric>Process</CustomTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((cell, index) => {
                      var rowClass = (index == this.props.activegraph.graph.selectedresponse) ? 'selected-row' : '';
                      return (
                        <TableRow className={rowClass} key={index} onClick={() => {this.handleRowClick(index)}}>
                          <CustomTableCell component="th" scope="row">
                            {index}
                          </CustomTableCell>
                          <CustomTableCell numeric>{cell.processid}</CustomTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Paper>
            <div className="right-table-footer">
              <div className="right-table-footer-content">
                <div className="info-container-right-footer">
                  <div className="right-table-process-prompt">Process ID:</div>
                  <div className="info-data">{processId}</div>
                  <div className="right-table-footer-icon-container">
                    <img className={renderInfo.filtericon} src={filterImage} onClick={() => {this.filterHandler(processId)}}/>
                    <img className={renderInfo.removefiltericon} src={filterRemoveImage} onClick={() => {this.removeFilterHandler(processId)}}/>
                  </div>
                </div>
                <div className="info-container-right-footer">
                  <div className="right-table-process-prompt">Timestamp:</div>
                  <div className="info-data">{this.formatDate(this.getDataField(data, 'timestamp'))}</div>
                </div>
              </div>
            </div>

            <br/><br/>
            <div className="info-container">
              <div className="info-prompt">Data:</div>
            </div>
            <div className="info-container">
              <div className="right-data-panel">
                {this.getDataField(data, 'data')}
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

RightPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};


const mapDispatchToProps = (dispatch) => {
  return {};
}

function mapStateToProps(state) {
  return {
    activegraph: state.gr.activegraph,
    selectedstep: state.gr.selectedstep
  };
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(RightPanel);

// export default withStyles(styles)(RightPanel);
