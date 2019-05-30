import '../styles/index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import LeftPanel from './ui/left/LeftPanel';
import RightPanel from './ui/right/RightPanel';
import ScrollableTabsButtonAuto from './ui/graph/GraphTabs.js';
import CodeflowServer from './server/CodeflowServer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Settings from './data/Settings.js';

import $ from 'jquery'; 

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
    this.settings = new Settings();
    this.props = props;
    this.table = React.createRef();
    this.leftPanel = React.createRef();
    this.rightPanel = React.createRef();
    this.leftResizer = React.createRef();
    this.rightResizer = React.createRef();
  }

  componentDidMount(){
    document.title = "CodeFlow";
    this.handleWindowSize();
    this.resizeLeft({clientX:this.leftResizer.current.offsetLeft});
    this.resizeRight({clientX:this.rightResizer.current.offsetLeft});
  }

  handleWindowSize()  {
    
    var _this = this;

    $(window).resize((e) => {
      _this.doResize(e)
    });
  }

  doResize()  {
    $(this.table.current).height($(window).height());
  }

  resizeLeft(e)  {
    this.leftPanel.current.style.width = (e.clientX - 5) + 'px';
    var leftPanelContent = $(this.table.current).find('#left-drawer-content');
    leftPanelContent.width(e.clientX - 4);
    window.dispatchEvent(new Event('resize'));
  }

  resizeRight(e)  {
    var width = $(window).width() - e.clientX;
    this.rightPanel.current.style.width = width + 'px';
    var rightPanelContent = $(this.table.current).find('#right-drawer-content');
    rightPanelContent.width(width + 6);
    window.dispatchEvent(new Event('resize'));
  }

  render()  {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
         <div>
          <CodeflowServer/>
          <div className={classes.root}>
            <table ref={this.table} style={{'width':'100%', 'height':'100%', 'borderCollapse': 'collapse', 'borderSpacing': '0px'}}>
              <tbody>
                <tr>
                  <td valign="top" style={{width:'300px'}} ref={this.leftPanel}>
                    <LeftPanel/>
                  </td>
                  <td valign="top" draggable="true" ref={this.leftResizer}
                      onDragEnd={(e) => {this.resizeLeft(e)}}
                      style={{width:'1px', borderLeft:'1px solid #BBB', position:'relative', cursor:'col-resize', height:'100%'}}>
                      <div draggable="true" 
                        onDragEnd={(e) => {this.resizeLeft(e)}}
                        style={{backgroundColor1:'#f00', height:'100%', position:'absolute', left:'0px', width:'10px', zIndex:'100'}}>
                      </div>
                  </td>
                  <td valign="top" style={{width:'calc(100% - 600px)', height:'100%', position:'relative'}} id="graph-content-cell">
                    <ScrollableTabsButtonAuto/>
                  </td>
                  <td valign="top" draggable="true" ref={this.rightResizer}
                      onDragEnd={(e) => {this.resizeRight(e)}}
                      style={{width:'1px', borderLeft:'1px solid #BBB', position:'relative', cursor:'col-resize', height:'100%'}}>
                      <div draggable="true" 
                        onDragEnd={(e) => {this.resizeRight(e)}}
                        style={{backgroundColor1:'#f00', height:'100%', position:'absolute', left:'-10px', width:'10px', zIndex:'100'}}>
                      </div>
                  </td>
                  <td valign="top" style={{width:'300px', position:'relative'}} ref={this.rightPanel}>
                    <RightPanel/>
                  </td>
                </tr>
              </tbody>
            </table>
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
