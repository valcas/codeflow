import React, {PureComponent} from 'react';

import {connect} from 'react-redux'
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Tree from './tree/Tree';
import LeftToolbar from './LeftToolbar';

import codeflowLogo from '../../../images/codeflow-logo.svg';

const styles = theme => ({
  drawerPaper: {
    borderRight:'none',
    width: 'auto',
    height:'100%',
    overflow:'hidden'
  },
  appbar:  {
      height:36
  },
  toolbar: {
    padding: 'unset',
    minHeight:'unset',
    height:'10px'
  }
});

class LeftPanel extends PureComponent {

  constructor(props)  {
    super(props);
    this.props = props;
    this.state = {searchText: ""};
  }

  render()  {

    const { classes } = this.props;

    var playIconClass = 'port-icon' + (this.props.settings.listening ? ' icon-disabled' : '');
    var stopIconClass = 'port-icon' + (this.props.settings.listening ? '' : ' icon-disabled');
    var portInputDisabled = this.props.settings.listening ? true : false;

    return(
      <Drawer variant="permanent" classes={{paper: classes.drawerPaper}}>
        <div id="left-drawer-content">
          <AppBar id="appbar" className={classes.appbar} position="static" color="default">
            <Toolbar id="toolbar" className={classes.toolbar} >
              <img className="logo" style={{height:'30px', marginTop:'5px'}} src={codeflowLogo}/>
            </Toolbar>
          </AppBar>
          <div style={{display:'grid', height:'100%'}}>
            <div style={{width:'-webkit-fill-available'}}>
              <LeftToolbar settings={this.props.settings}/>
              <Tree settings={this.props.settings}/>
            </div>            
          </div>
        </div>
      </Drawer>
    );
  }
}

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