import React from 'react';

import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    button: {
      minHeight:'35px',
      textTransform: 'none',
      minWidth:'auto'
    },
    tabs: {
      minHeight:'35px'
    }
  });
  
export default class GraphFooter extends React.Component {

    render()    {
        return (
            <div className="graph-footer">
                <TextField
                    id="standard-name"
                    value="test"
                    // onChange=""
                    margin="normal"
                />                
            </div>
        )
    }

}