import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import store from '../../redux/CodeflowStore';
import GraphRenderer from './GraphRenderer';
import {connect} from 'react-redux'
import compose from 'recompose/compose';

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
});

class ScrollableTabsButtonAuto extends React.Component {

  constructor()	{
	  super();
	this.state = { activetab:0 };
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
      nodes.push(<GraphRenderer key={this.props.activegraph.graph.name} graph={this.props.activegraph}/>);
    }

    return nodes;

  }

  render() {

    this.graphs = this.props.graphs;
    const { currentGraph } = this.state;
    const { classes } = this.props;
    this.state.activetab = 0;

    if (this.props.activegraph != null)  {
      this.state.activetab = this.props.activegraph.index;
    }

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.activetab}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
          return (
            {this.graphs.map(n => {
                return <Tab key={n.name} label={n.name}/>;
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
