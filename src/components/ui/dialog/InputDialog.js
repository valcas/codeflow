import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UAParser } from 'ua-parser-js';

export default class InputDialog extends Component  {
    
    constructor(props)   {
        super(props);
        this.state = {done:false};
        this.handleClose = this.handleClose.bind(this);
        this.setInputRef = this.setInputRef.bind(this);
        this.inputField = React.createRef();
    }

    handleClose()   {
        this.props.config.open = false;
        this.setState(this.state);
    }

    handleAction()  {
        this.props.config.actionButton.handler(this.inputField.value);
        this.handleClose();
    }

    setInputRef(ref)    {
        this.inputField = ref;
    }

    render()    {

        return (
            <div>
                <Dialog open={this.props.config.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.props.config.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{this.props.config.prompt}</DialogContentText>
                    <TextField inputRef={this.setInputRef} autoFocus margin="dense" id="name"
                    label={this.props.config.label} type="email" fullWidth/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">Cancel</Button>
                    <Button onClick={() => {this.handleAction()}} color="primary">{this.props.config.actionButton.label}</Button>
                </DialogActions>
                </Dialog>
            </div>
        );

    }

}