import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from 'material-ui/Typography';
import {connect} from 'react-redux'
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import store from '../redux/CodeflowStore';
import FileStore from '../file/FileStore';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
//import AccountCircle from '@material-ui/icons/AccountCircle';
import playIcon from '../../images/play.svg';
import stopIcon from '../../images/stop.svg';
import codeflowLogo from '../../images/codeflow-logo.svg';

const {app, dialog} = window.require('electron').remote;
const drawerWidth = 300;

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
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

class LeftPanel extends PureComponent {

  constructor(props)  {
    super(props);
    this.props = props;
  }

  openDiagram()  {

    var me = this;

    dialog.showOpenDialog({properties: ['openFile']}, function (files) {
        if (files !== undefined) {
            var file = files[0];
            var xml = new FileStore().getFile(file);
            var name = file.split('\\');
            name = name[name.length - 1];
            name = name.split('.')[0];
            var graph = {xml:xml, file:file, name:name};
            // me.loadGraphXML(xml);
            store.dispatch({type: 'LOAD_GRAPH', payload: {graph:graph}});
            // store.dispatch({type: 'SET_ACTIVE_GRAPH', payload: {activegraph:{graph:graph}}});
        }
    });

  }

  handleStop()  {
    store.dispatch({type: 'SET_LISTENING_STATE', payload: false});
  }

  handlePlay()  {
    store.dispatch({type: 'SET_LISTENING_STATE', payload: true});
  }

  handlePortChange(event)  {
    store.dispatch({type: 'SET_LISTENING_PORT', payload: event.target.value});
  }

  clear() {
    store.dispatch({type: 'CLEAR_GRAPH_DATA'});
  }

  render()  {

    const { classes } = this.props;

    var playIconClass = 'port-icon' + (this.props.settings.listening ? ' icon-disabled' : '');
    var stopIconClass = 'port-icon' + (this.props.settings.listening ? '' : ' icon-disabled');
    var portInputDisabled = this.props.settings.listening ? true : false;

//    <AccountCircle />
    return(
      <div>
        <Drawer variant="permanent" classes={{paper: classes.drawerPaper}}>
          <AppBar className={classes.appbar} position="static" color="default">
            <Toolbar>
              <img className="logo" src={codeflowLogo}/>
            </Toolbar>
          </AppBar>
          <div className="info-container">
            <div className="info-prompt">
              <FormControl className={classes.margin} disabled={portInputDisabled}>
              <InputLabel htmlFor="input-with-icon-adornment">Listen Port</InputLabel>
              <Input
              id="input-with-icon-adornment"
              value={this.props.settings.listenport}
              onChange={(e) => {this.handlePortChange(e)}}
              />
              </FormControl>
            </div>
            <div className="info-prompt">
              <img className={playIconClass} src={playIcon} onClick={this.handlePlay}/>
            </div>
            <div className="info-prompt">
              <img className={stopIconClass} src={stopIcon} onClick={this.handleStop}/>
            </div>
          </div>
          <div><Button className={classes.button} onClick={this.openDiagram}>Open Diagram</Button></div>
          <div><Button className={classes.button} onClick={this.clear}>Clear</Button></div>

        </Drawer>
      </div>
    );
  }
}

LeftPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {};
}

function mapStateToProps(state) {
  return {
    settings: state.sr.settings
  };
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(LeftPanel);

// export default withStyles(styles)(LeftPanel);
