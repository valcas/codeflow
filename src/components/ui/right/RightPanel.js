import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose';
import {connect} from 'react-redux'
import store from '../../redux/CodeflowStore';

import StepEventDataPanel from './StepEventDataPanel';
import TimeChartDialog from '../dialog/TimeChartDialog';
import KeysComp from '../components/KeysComp';
import InputDialog from '../dialog/InputDialog'
import EventTable from './EventTable';

import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import filterImage from '../../../images/filter.svg';
import filterRemoveImage from '../../../images/filter-remove.svg';
import timeChartImage from '../../../images/timechart.svg';
import deleteIcon from '../../../images/delete.svg';
import saveIcon from '../../../images/baseline-save-24px.svg';
import trashIcon from '../../../images/baseline-delete_forever-24px.svg';

const JsonConfig = window.require('json-config/lib/json-config').default;
const drawerWidth = 'calc(100% + 3px)';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    // borderLeft:'1px solid #CCC'
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
    // position: 'relative',
    width: drawerWidth,
    height:'100%',
    left: 'auto',
    overflow: 'hidden',
    // borderLeft: '1px solid #DDD'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  appbar:  {
      height:36
  },
  filterText: {
    width:'96%'
  },
  toolbar: theme.mixins.toolbar,
});

class RightPanel extends Component {

  constructor(props)  {
    
    super(props);
    var _this = this;

    this.state = {
      selectedresponse : null, 
      timeChartDialog:{open:false}, 
      saveDialog:{open:false, title:'Save Session', label:'Session Name', 
        actionButton:{
            label:'OK',
            handler:function(value) {
              _this.handleSessionSave(value);
            }
        }, 
        prompt:'Enter a name for your session below'
      }
    };
    
    this.id = 0;
    this.props = props;

    this.handleResponseChange = this.handleResponseChange.bind(this);
    this.timeChartDialog = React.createRef();

  }

  handleResponseChange(event)  {
    this.setState({selectedresponse : event.target.value});
  }

  getDataField(data, name)  {
    if (this.props.activegraph && this.props.activegraph.graph 
          && this.props.activegraph.graph.selectedresponse != null 
          && data.length > parseInt(this.props.activegraph.graph.selectedresponse)) {
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
    var tmp = Object.assign({}, this.state);
    tmp.timeChartDialog = {open:true, steps:this.getProcessSteps()};
    this.setState(tmp);
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
        if (stepData[iItem].processid == graph.currentfilter.processid) {
          timechartData.push({stepname:stepKeys[iStep], stepinfo:stepData[iItem]});
        }
      }
    }

    return timechartData;

  }

  handleFilterTextChange(e) {
      store.dispatch({type: 'SET_SEARCH_TEXT', payload: e.target.value});
  }

  handleClearFilterClicked()  {
    store.dispatch({type: 'SET_SEARCH_TEXT', payload: ''});
  }

  handleSaveIconClicked() {
    var tmp = Object.assign({}, this.state);
    tmp.saveDialog.open = true;
    this.setState(tmp);
  }

  handleSessionSave(file) {
    if ( ! file.toUpperCase().endsWith(".JSON"))  {
      file += ".json"
    }
    var filepath = this.props.activegraph.graph.file;
    filepath = filepath.substring(0, filepath.lastIndexOf('\\'));
    store.dispatch({type: 'SAVE_SESSION_DATA', payload: {projectPath:filepath, filename:file}});
    store.dispatch({type: 'RELOAD_PROJECT', payload:{projectPath:filepath}});
  }

  handleClearSession()  {
    store.dispatch({type: 'CLEAR_GRAPH_DATA'});
  }

  render()  {

    var me = this;
    const { classes } = this.props;
    var cfg = new JsonConfig(this.props);

    var data = []
    if (this.props.activegraph && this.props.activegraph.graph && this.props.activegraph.graph.data && this.props.selectedstep)  {
      data = this.props.activegraph.graph.filterdata[this.props.selectedstep];
    }

    data = (data == null) ? [] : data;
    var processId = this.getDataField(data, 'processid');
    var currentfilter = this.getDataField(data, 'currentfilter');
    var keys = this.getDataField(data, 'keys');

    var hasProcessId = (processId && this.props.activegraph.graph.currentfilter && this.props.activegraph.graph.currentfilter.processid);
    var renderInfo = {};
    renderInfo.filtericon = 'small-icon' + (hasProcessId ? ' icon-disabled' : '');
    renderInfo.removefiltericon = 'small-icon' + (( ! hasProcessId) ? ' icon-disabled' : '');
    renderInfo.timeGraphIcon = 'small-icon' + (( ! hasProcessId) ? ' icon-disabled' : '');

    return(
      <div className="right-panel">
        <Drawer variant="permanent" classes={{paper: classes.drawerPaper}}>
          <div id="right-drawer-content" style={{height:'100%'}}>
            <AppBar className={classes.appbar} position="static" color="default">
              <Toolbar>
              </Toolbar>
            </AppBar>
            <table style={{height:'98%', width1:'300px', borderCollapse:'collapse', width:'100%'}}>
              <tbody>
                <tr>
                  <td valign="top" style={{height:'50%'}}>
                    <div className="info-container-right-footer" style={{display:'table', margin:'0px 0px 0px 5px'}}>
                      <div style={{display:'table-cell'}}>
                        <TextField className={classes.filterText} id="txtFilter"
                          value={cfg.getValue('activegraph/graph/currentfilter/searchtext', '')}
                          onChange={(e) => {this.handleFilterTextChange(e)}}
                          label="Filter" margin="dense"/>
                      </div>
                      <div className="icon-toolbar-icon" style={{minWidth:'25px', display:'table-cell', verticalAlign:'bottom'}}>
                        <img src={deleteIcon} style={{width:'24px'}} onClick={() => {this.handleClearFilterClicked()}}/>
                      </div>
                      <div className="icon-toolbar-icon" style={{minWidth:'25px', display:'table-cell', verticalAlign:'bottom'}}>
                        <img src={saveIcon} onClick={() => {this.handleSaveIconClicked()}}/>
                      </div>
                      <div className="icon-toolbar-icon" style={{minWidth:'25px', display:'table-cell', verticalAlign:'bottom'}}>
                        <img src={trashIcon} onClick={() => {this.handleClearSession()}}/>                      
                      </div>
                    </div>
                    <div className="info-container">
                      <div className="info-data" style={{height:'30px', padding:'0px 0px 0px 5px'}}>{this.props.selectedstep}</div>
                    </div>               
                    <div className="right-table-container">
                      <EventTable props={this.props} data={data} activegraph={this.props.activegraph} rowClickHandler={this.handleRowClick}/>
                    </div>
                    <div className="right-table-footer">
                      <div className="right-table-footer-content">
                        <div className="info-container-right-footer">
                          <div className="right-table-process-prompt">Process ID:</div>
                          <div className="info-data-white">{processId}</div>
                          <div className="right-table-footer-icon-container">
                            <img className={renderInfo.filtericon} src={filterImage} onClick={() => {this.filterHandler(processId)}}/>
                            <img className={renderInfo.removefiltericon} src={filterRemoveImage} onClick={() => {this.removeFilterHandler(processId)}}/>
                            <img className={renderInfo.timeGraphIcon} src={timeChartImage} onClick={() => {this.showTimeGraph(processId)}}/>
                          </div>
                        </div>
                        <div className="info-container-right-footer">
                          <div className="right-table-process-prompt">Keys:</div>
                          <div className="info-data-white">
                            <KeysComp keys={keys} activegraph={this.props.activegraph}/>
                          </div>
                        </div>
                        <div className="info-container-right-footer">
                          <div className="right-table-process-prompt">Timestamp:</div>
                          <div className="info-data-white">{this.formatDate(this.getDataField(data, 'timestamp'))}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style={{height:'50%'}}>
                    <StepEventDataPanel data={this.getDataField(data, 'data')}/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Drawer>
        <TimeChartDialog ref={me.timeChartDialog} state={this.state.timeChartDialog}/>
        <InputDialog config={this.state.saveDialog}/>
      </div>
    );
  }
}

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