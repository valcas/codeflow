import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import {connect} from 'react-redux'
import compose from 'recompose/compose';
import GraphRenderer from './ui/graph/GraphRenderer';
import LeftPanel from './ui/LeftPanel';
import ScrollableTabsButtonAuto from './ui/graph/GraphTabs.js';
import DynagramServer from './server/DynagramServer';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Settings from './data/Settings.js';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#29ABE2',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
  },
  status: {
    danger: 'orange',
  },
});

const styles = theme => ({
  root: {
      // flexGrow: 1,
      // height: 430,
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
    },
  content: {
    height:'100%',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    // padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
});

class App extends Component {

  constructor(props) {
    super(props);
    new Settings();
    this.props = props;
  }

  componentDidMount(){
    document.title = "codeflow";
  }

  render()  {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
         <div>
          <DynagramServer/>
          <div className={classes.root}>
            <div><LeftPanel/></div>
            <main className="graph-container">
              <ScrollableTabsButtonAuto/>
            </main>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
// <div><GraphRenderer/></div>


App.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(App);

function mapStateToProps(state) {
  return {
    activevalidationset: state.activevalidationset
  };
}

// export default App;
export default compose(
  // connect(mapStateToProps),
  withStyles(styles)
)(App);
