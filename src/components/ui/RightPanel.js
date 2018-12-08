import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose';
import {connect} from 'react-redux'
import store from '../redux/CodeflowStore';
import TimeChartDialog from './dialog/TimeChartDialog';
// import FileStore from '../file/FileStore';
// import List, { ListItem, ListItemText } from 'material-ui/List';
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
import timeChartImage from '../../images/timechart.svg';

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

    this.state = {selectedresponse : null, timeChartDialog:{open:false}};
    this.handleResponseChange = this.handleResponseChange.bind(this);
    this.timeChartDialog = React.createRef();
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

  showTimeGraph() {
    this.setState({selectedresponse : null, timeChartDialog:{open:true, steps:this.getProcessSteps()}});

  }

  handleRowClick(index)  {
    store.dispatch({type: 'SET_SELECTED_RESPONSE', payload:index});
  }

  formatDate(date)  {
    if (date == null) {
      return null;
    } else {
      var tempDate = new Date(+date);
      return tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds() + ":" + tempDate.getMilliseconds();
    }
  }

  getProcessSteps() {

    var timechartData = [];
    var graph = this.props.activegraph.graph;
    var stepKeys = Object.keys(graph.data);

    for (var iStep = 0; iStep < stepKeys.length; iStep++)  {
      var stepData = graph.data[stepKeys[iStep]];
      for (var iItem = 0; iItem < stepData.length; iItem++)  {
        if (stepData[iItem].processid == graph.currentfilter) {
          timechartData.push({stepname:stepKeys[iStep], stepinfo:stepData[iItem]});
        }
      }
    }

    return timechartData;

  }

  render()  {

    var me = this;
    const { classes } = this.props;

    var data = []
    if (this.props.activegraph.graph.data && this.props.selectedstep)  {
      data = this.props.activegraph.graph.filterdata[this.props.selectedstep];
    }

    var processId = this.getDataField(data, 'processid');

    var renderInfo = {};
    renderInfo.filtericon = 'small-icon' + ((processId && ( ! this.props.activegraph.graph.currentfilter)) ? '' : ' icon-disabled');
    renderInfo.removefiltericon = 'small-icon' + ((processId && this.props.activegraph.graph.currentfilter) ? '' : ' icon-disabled');
    renderInfo.timeGraphIcon = 'small-icon' + ((processId && this.props.activegraph.graph.currentfilter) ? '' : ' icon-disabled');

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
                    <img className={renderInfo.timeGraphIcon} src={timeChartImage} onClick={() => {this.showTimeGraph(processId)}}/>
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
        <TimeChartDialog ref={me.timeChartDialog} state={this.state.timeChartDialog}/>
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
