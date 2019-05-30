import React, {PureComponent} from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

import store from '../../redux/CodeflowStore';

import openIcon from '../../../images/baseline-folder-24px.svg';

const {app, dialog} = window.require('electron').remote;

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{        
        vertical: 'bottom',
        horizontal: 'center',
      }}
      style={{left:'130px',top:'10px'}}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
export default class LeftToolbar extends PureComponent {
    
    constructor(props)   {
        super(props);

        this.state = {
            anchorEl: null,
            mruAnchorEl:null,
            open: false,
            mruopen:false
        };
      
        this.handleFileClick = this.handleFileClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openFolder = this.openFolder.bind(this);
    }
  
    handleFileClick(e) {
        this.setState({open:true, anchorEl:e.target});
    }
  
    handleClose() {
        let state = Object.assign({}, this.state, {});
        state.open = false;
        state.mruopen = false;
        this.setState(state);
    }

    closeMru()  {
        let state = Object.assign({}, this.state, {});
        state.mruopen = false;
        this.setState(state);
    }

    handleMruClick(e)   {
        let state = Object.assign({}, this.state, {});
        state.mruAnchorEl = e.target
        state.mruopen = true;
        this.setState(state);
    }

    handleMruFileClick(location)    {
        store.dispatch({type: 'LOAD_PROJECT_FOLDER', payload: {location:location}});
        this.handleClose();
    }
      
    openFolder()   {

        this.handleClose();
        var me = this;

        dialog.showOpenDialog({properties: ['openDirectory']}, function (files) {
            if (files !== undefined) {
                store.dispatch({type: 'LOAD_PROJECT_FOLDER', payload: {location:files[0]}});
            }
        });
    }

    render()    {
        
        var mru = this.props.settings.mru ? this.props.settings.mru : [];

        return (
            <div className="icon-toolbar" style={{}}>
                <Button aria-owns={open ? 'fade-menu' : undefined} aria-haspopup="true" onClick={(e) => {this.handleFileClick(e)}}>
                    File...
                </Button>
                <Menu id="fade-menu" anchorEl={this.state.anchorEl} open={this.state.open}
                    onClose={this.handleClose} TransitionComponent={Fade}>
                    <MenuItem onClick={() => {this.openFolder()}}>Open Folder</MenuItem>
                    <Divider />
                    <MenuItem 
                        onMouseEnter={(e) => {this.handleMruClick(e)}}
                        // onMouseLeave={(e) => {this.closeMru(e)}}
                    >Recent Folders</MenuItem>
                </Menu>
                <StyledMenu id="mru-menu" anchorEl={this.state.anchorEl} open={this.state.mruopen}
                    onClose={this.handleClose} TransitionComponent={Fade}>
                    {mru.map((mruItem, index) => {                        
                        return <MenuItem onClick={() => {this.handleMruFileClick(mruItem)}} key={index}>{mruItem}</MenuItem>
                    })}
                </StyledMenu>
            </div>
        )
    }

}