import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BasicMarker from '../markers/BasicMarker'
import {connect} from 'react-redux'
import compose from 'recompose/compose';
import store from '../../redux/DynagramStore';
import Badge from 'material-ui/Badge';

const offsetY = 40;

class MarkerCanvas extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {markers:[]};
    console.log(this.state);
  }

  cellReceived(id, cell)  {
      console.log(cell.geometry);

      var style = {
        top: cell.geometry.y + offsetY + 5,
        left: cell.geometry.x + 5
      }

      var markers = this.state.markers;
      markers.push({id:id, comp:<div className='marker-canvas' style={style}><BasicMarker/></div>});

      this.setState({markers:markers});
  }

  getCell(stepid) {
    var cell = this.props.activegraph.graph.graphcells[stepid];

    var style = {
      top: cell.geometry.y + offsetY + 5,
      left: cell.geometry.x + 5
    }

    var size = this.props.activegraph.graph.filterdata[stepid].length;

    return <div className='marker-canvas' style={style}>
      <Badge className="marker-basic" badgeContent={size} color="primary">
      </Badge>
    </div>
    // return cell.comp;
  }

  handleMarkerClick(stepname) {
    store.dispatch({type: 'SET_SELECTED_STEP', payload:{selectedstep:stepname}});
  }

  render() {

    var me = this;
    const { classes } = this.props;

    var markerdata = this.props.activegraph.graph.filterdata;
    markerdata = (markerdata == null ? [] : markerdata);

    // var markers = this.props.activegraph.data;
    return (
      <div>
          {Object.keys(markerdata).map((cell, index) => {
            return (
                <div key={cell} onClick={() => this.handleMarkerClick(cell)}>
                  {me.getCell(cell)}
                </div>
            );
          })}
      </div>
    );

  }

}

const mapDispatchToProps = (dispatch) => {
  return {};
}

function mapStateToProps(state) {
  return {
    activegraph: state.gr.activegraph,
    selectedstep: state.gr.selectedstep
  };
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // withStyles(styles)
)(MarkerCanvas);
