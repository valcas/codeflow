import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import store from '../../redux/CodeflowStore';
import GraphRenderer from './GraphRenderer';

// import GraphFooter from './GraphFooter';

import deleteIcon from '../../../images/delete.svg';
import codeflowLogo from '../../../images/codeflow-logo.svg';

import $ from 'jquery'; 

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

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

class ScrollableTabsButtonAuto extends React.Component {

  constructor()	{
	  super();
    this.state = { activetab:0 };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ activetab:value });
    store.dispatch({type: 'SET_ACTIVE_GRAPHINDEX', payload: {activegraph:value}});
  };

  showTab(artefact) {

    var me = this;
    var ret = null;
    var count = 0;
    global.InforamaConfig.getCaseFileManager().getOpenArtefacts().forEach(function(item)  {
      if (item.filename === artefact.filename) {
        ret = item;
        me.state.value = count;
      }
      count++;
    });

    store.dispatch({type: 'SET_CURRENT_WEBFORM', payload: ret});

    return ret;

  }

  getArtefactIcon(n) {

  }

  getCurrentArtefactType(type) {
    var openartefacts = global.InforamaConfig.getCaseFileManager().getOpenArtefacts();
    if (openartefacts != null && openartefacts.length > 0)  {
      var currentArtefact = openartefacts[this.state.value];
      return currentArtefact.type === type;
    }
    return false;
  }

  getGraphNodes()  {

    var nodes = [];

    if ((this.props.activegraph != null) && (this.props.activegraph.graph != null)) {
      nodes.push(
        <div>
          <GraphRenderer key={this.props.activegraph.graph.name} graph={this.props.activegraph}/>
          {/* <GraphFooter/> */}
        </div>
      );
    } else {
      return (
        <div style={{marginTop:'200px', textAlign:'center'}}>
          <img style={{width:'50%'}} src={codeflowLogo}/>
        </div>
      );
    }

    return nodes;

  }

  handleTabMouseEnter(e)  {
    $(e.currentTarget).find('.tab-close-icon').css('display', 'block');
  }

  handleTabMouseLeave(e)  {
    $(e.currentTarget).find('.tab-close-icon').css('display', 'none');
  }

  handleTabCloseClick(n)  {
    store.dispatch({type: 'CLOSE_GRAPH', payload: n.file});
  }

  render() {

    this.graphs = this.props.graphs;
    const { currentGraph } = this.state;
    const { classes } = this.props;
    this.state.activetab = 0;

    if (this.props.activegraph != null)  {
      this.state.activetab = this.props.activegraph.index;
    }

    var scrollProp = this.graphs.length > 0 ? true : false;

    return (
      <div className={classes.root} style={{position:'absolute', left:'0px'}}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.activetab}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable={scrollProp}
            scrollButtons={scrollProp}
            className={classes.tabs}
          >
          return (
            {this.graphs.map(n => {
                return <Tab className={classes.button} key={n.name} 
                  onMouseEnter={e => {this.handleTabMouseEnter(e);}} 
                  onMouseLeave={e => {this.handleTabMouseLeave(e);}} 
                  label={
                    <div style={{display:'table'}}>
                      <div style={{display:'table-cell'}}>
                        {n.name}
                      </div>
                      <div className="tab-close-icon" style={{marginLeft:'10px', position:'absolute', display:'none'}}>
                        <img src={deleteIcon} style={{width:'16px'}} onClick={() => {this.handleTabCloseClick(n)}}/>
                      </div>
                    </div>
                }/>;
            })}
          );
          </Tabs>
          </AppBar>
          {this.getGraphNodes()}
      </div>
    );

  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {};
}

function mapStateToProps(state) {
  return {
    graphs: state.gr.graphs,
    activegraph: state.gr.activegraph
  };
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(ScrollableTabsButtonAuto);

// export default withStyles(styles)(ScrollableTabsButtonAuto);
