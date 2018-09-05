import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import FileStore from '../../file/FileStore';
import MarkerCanvas from './MarkerCanvas';
import RightPanel from '../RightPanel';
import {connect} from 'react-redux'
import compose from 'recompose/compose';
import store from '../../redux/CodeflowStore';

/*import {
    mxClient,
    mxGraph,
    mxRubberband,
    mxUtils,
    mxEvent
} from "mxgraph-js";
*/

const {remote} = window.require('electron');
const {app, dialog} = window.require('electron').remote;

var electron = window.require('electron');

var renderer;

class GraphRenderer extends PureComponent {

  constructor(props)  {
    super(props);

    var me = this;
    electron.ipcRenderer.on('openGraph', function(event, message) {
      me.openGraph();
    });

    this.codeflowElements = {};
    this.markerCanvas = React.createRef();

    this.createListener();

  }

  createListener() {

    var me = this;
    window.addEventListener('datareceived', function (e) {
        me.handleData(e.detail)
    });

  }

  handleData(data)  {
    var id = data.stepid;
    var cell = this.codeflowElements[id]
    this.markerCanvas.current.cellReceived(id, cell);
  }

  openGraph()  {

    var me = this;

    dialog.showOpenDialog({properties: ['openFile']}, function (files) {
      if (files !== undefined) {
        var file = files[0];
        var xml = new FileStore().getFile(file);
        me.loadGraphXML(xml);
      }
    });

  }

  componentDidMount() {

    var _this = this;
    window.mxUtils.getAll(['./lib/mxGraph/styles/default.xml'], function(xhr) {
    // window.mxUtils.getAll(['', '/lib/mxGraph/styles/default.xml'], function(xhr) {
      // Adds bundle text to resources
      window.mxResources.parse(xhr[0].getText());
      // Configures the default graph theme
      var themes = new Object();
      themes['default'] = xhr[0].getDocumentElement();

      var anchor = document.getElementById('graphContainer');
      _this.graph = new window.mxGraph(anchor);
      _this.graph.setHtmlLabels(true);
      _this.graph.themes = themes;
      // _this.graph.stylesheet
      var dec = new window.mxCodec(themes['default']);
      dec.decode(themes['default'], _this.graph.stylesheet);

      if (_this.props.activegraph.graph != null) {
        _this.loadGraphXML(_this.props.activegraph.graph.xml);
        store.dispatch({type: 'SET_GRAPH_CELLS', payload: {graphcells:_this.codeflowElements}});
      }

    });

  }

  loadGraphXML(xml) {

    this.addStencilSets();

    var doc = window.mxUtils.parseXml(xml);
    // window.mxStencilRegistry.parseStencilSet(doc);
    var codec = new window.mxCodec(doc);
    var rootNode = doc.getElementsByTagName("root")[0];
    var elt = rootNode.firstChild;
    var cells = [];
    var model = this.graph.getModel();
    var parent = this.graph.getDefaultParent();

    while (elt != null){

      var dynId = null;
      var cell = codec.decodeCell(elt);
      if ((cell.style) && (cell.style.indexOf('shape=') > -1)) {
        // console.log(cell.style);
        // var label = cell.value;
        // cell = this.graph.createVertex(parent, null, label, cell.geometry.x, cell.geometry.y, cell.geometry.width, cell.geometry.height, cell.style);
      }
      if (elt.nodeName == 'object')  {
        dynId = elt.getAttribute('codeflow-id');
        cell.setValue(elt.getAttribute('label'));
      }

      if (dynId != null)  {
        this.codeflowElements[dynId] = cell;
      }
      cells.push(cell);
      this.graph.refresh();
      elt = elt.nextSibling;
    }

    this.graph.addCells(cells);
    var state = this.graph.view.getState(cells[5]);

    this.graph.view.revalidate();
  }

  addStencilSets() {

    // var stencils = ['basic'];
    //
    // var req = window.mxUtils.load("lib/mxGraph/stencils/flowchart.xml");
    // var root = req.getDocumentElement();
    // var shape = root.firstChild;
    // var packageName = 'mxgraph.flowchart';
    //
    // while (shape != null)
    // {
    //   if (shape.nodeType == window.mxConstants.NODETYPE_ELEMENT)
    //   {
    //     window.mxStencilRegistry.addStencil(packageName + '.' + shape.getAttribute('name').toLowerCase(), new window.mxStencil(shape));
    //   }
    //
    //   shape = shape.nextSibling;
    // }

    this.addStencilSet('arrows.xml', 'mxgraph.arrows');
    this.addStencilSet('basic.xml', 'mxgraph.basic');
    this.addStencilSet('bpmn.xml', 'mxgraph.bpmn');
    this.addStencilSet('flowchart.xml', 'mxgraph.flowchart');

  }

  addStencilSet(filename, packageName) {

    var req = window.mxUtils.load('./lib/mxGraph/stencils/' + filename);
    var root = req.getDocumentElement();
    var shape = root.firstChild;

    while (shape != null)
    {
      if (shape.nodeType == window.mxConstants.NODETYPE_ELEMENT)
      {
        window.mxStencilRegistry.addStencil(packageName + '.' + shape.getAttribute('name').toLowerCase(), new window.mxStencil(shape));
      }

      shape = shape.nextSibling;
    }

  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <div ref={window.graphRenderer}>
          <div id="graphContainer" className='graph-container'>
        	</div>
        </div>
        <div><MarkerCanvas ref={this.markerCanvas}/></div>
        <div><RightPanel/></div>
      </div>
    );

  }

}

const mapDispatchToProps = (dispatch) => {
  return {};
}

function mapStateToProps(state) {
  return {
    activegraph: state.gr.activegraph
  };
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // withStyles(styles)
)(GraphRenderer);
