import React, {Component} from 'react';

import {connect} from 'react-redux'
import compose from 'recompose/compose';
import store from '../../../redux/CodeflowStore';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import SettingsPanel from './SettingsPanel'

import playIcon from '../../../../images/play.svg';
import stopIcon from '../../../../images/stop.svg';

const drawerWidth = 300;

const styles = theme => ({
    margin: {
      margin: theme.spacing.unit,
    }
});

class PortSetting extends Component {

    handleStop()  {
        store.dispatch({type: 'SET_LISTENING_STATE', payload: false});
    }

    handlePlay()  {
        store.dispatch({type: 'SET_LISTENING_STATE', payload: true});
    }
    
    render()    {

        const { classes } = this.props;

        var playIconClass = 'port-icon' + (this.props.settings.listening ? ' icon-disabled' : '');
        var stopIconClass = 'port-icon' + (this.props.settings.listening ? '' : ' icon-disabled');
        var portInputDisabled = this.props.settings.listening ? true : false;
    
        return (

            <div className="info-container">
                <div className="info-prompt">
                <FormControl className={classes.margin} disabled={portInputDisabled}>
                    <InputLabel htmlFor="input-with-icon-adornment">Listen Port</InputLabel>
                    <Input id="port-input"
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
)(PortSetting);
  