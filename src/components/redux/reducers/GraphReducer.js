const fs = window.require('fs');

const initialState = {
  graphs: [],
  acivegraph : null
};

const graphReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_GRAPH':
      let newArray = state.graphs.slice();
      newArray.push(action.payload.graph);
      return {graphs:newArray, activegraph:{index:newArray.length - 1, graph:action.payload.graph}};
    case 'SET_ACTIVE_GRAPHINDEX':
      return {graphs:state.graphs, activegraph:{index:action.payload.activegraph, graph:state.graphs[action.payload.activegraph]}};
    case 'SET_GRAPH_CELLS':
      for (var i = 0; i < state.graphs.length; i++) {
        if (state.graphs[i].name === state.activegraph.graph.name)  {
          state.graphs[i].graphcells = action.payload.graphcells;
          state.activegraph.graph = state.graphs[i];
        }
      }
      return {graphs:state.graphs, activegraph:state.activegraph};
    case 'DATA_RECEIVED':

	  state.activegraph = state.activegraph ? state.activegraph : {};
      var data = action.payload.data;
      var diagramId = data.diagramid;
      var targetGraph = null;
      var stepid = action.payload.data.stepid;
	    var activegraph = Object.assign({}, state.activegraph, {});

      for (var i = 0; i < state.graphs.length; i++) {
        if (state.graphs[i].name === diagramId)  {
    		  var targetGraph = Object.assign({}, state.graphs[i], {});

          if (targetGraph.data == null)  {
            targetGraph.data = {};
          }
          if (targetGraph.data[stepid] == null)  {
            targetGraph.data[stepid] = [];
          }
          var stepdata = targetGraph.data[stepid];
          stepdata.push({action:data.action, processid:data.processid, data:data.data, timestamp:data.timestamp});
          state.graphs[i] = targetGraph;
          targetGraph.filterdata = stepdata;
          if (activegraph.graph.name === diagramId) {
            activegraph.graph.data = targetGraph.data;
            activegraph.graph.filterdata = targetGraph.data;
          }
        }
      }
      return {graphs:state.graphs, activegraph:activegraph, selectedstep:state.selectedstep};

    case 'SET_SELECTED_STEP':

      return {graphs:state.graphs, activegraph:state.activegraph, selectedstep:action.payload.selectedstep};

    case 'FILTER_PROCESS':

      var processid = action.payload.processid;

      var filteredData = {};
      var activegraph = Object.assign({}, state.activegraph, {});

      for (var i = 0; i < state.graphs.length; i++) {
        if (state.graphs[i].name === state.activegraph.graph.name)  {

          var graph = state.graphs[i];
          var stepKeys = Object.keys(graph.data);

          for (var iStep = 0; iStep < stepKeys.length; iStep++)  {
            var stepData = graph.data[stepKeys[iStep]];
            for (var iItem = 0; iItem < stepData.length; iItem++)  {
              if (stepData[iItem].processid == processid) {
                if (filteredData[stepKeys[iStep]] == null)  {
                  filteredData[stepKeys[iStep]] = [];
                }
                filteredData[stepKeys[iStep]].push(stepData[iItem]);
              }
            }
          }

          graph.filterdata = filteredData;
          activegraph.graph.filterdata = filteredData;
          graph.currentfilter = processid;
          activegraph.graph.currentfilter = processid;
          graph.selectedresponse = 0;
          activegraph.graph.selectedresponse = 0;

        }

      }

      return {graphs:state.graphs, activegraph:activegraph, selectedstep:state.selectedstep};

      case 'REMOVE_FILTER':

        for (var i = 0; i < state.graphs.length; i++) {

          if (state.graphs[i].name === state.activegraph.graph.name)  {
            var graph = state.graphs[i];

      			var activegraph = Object.assign({}, state.activegraph, {});
            activegraph.graph.filterdata = activegraph.graph.data;
            graph.filterdata = activegraph.graph.data;
            activegraph.graph.currentfilter = null;
            graph.currentfilter = null;

            return {graphs:state.graphs, activegraph:activegraph, selectedstep:state.selectedstep};
          }

        }

    case 'SET_SELECTED_RESPONSE':

      for (var i = 0; i < state.graphs.length; i++) {

        if (state.graphs[i].name === state.activegraph.graph.name)  {
          var graph = state.graphs[i];

          var activegraph = Object.assign({}, state.activegraph, {});
          activegraph.graph.filterdata = activegraph.graph.data;
          graph.filterdata = activegraph.graph.data;
          activegraph.graph.currentfilter = null;
          graph.currentfilter = null;
          activegraph.graph.selectedresponse = action.payload;
          graph.selectedresponse = action.payload;

          return {graphs:state.graphs, activegraph:activegraph, selectedstep:state.selectedstep};
        }

      }

    case 'CLEAR_GRAPH_DATA':

      var activegraph = Object.assign({}, state.activegraph, {});

      for (var i = 0; i < state.graphs.length; i++) {
        if (state.graphs[i].name === state.activegraph.graph.name)  {
          var targetGraph = Object.assign({}, state.graphs[i], {});
          targetGraph.data = {};
          targetGraph.filterdata = {};
          state.graphs[i] = targetGraph;
          activegraph.graph = Object.assign({}, targetGraph, {});
        }
      }
      return {graphs:state.graphs, activegraph:activegraph};

    case 'SAVE_SESSION_DATA':

      fs.writeFileSync(action.payload.filename, JSON.stringify({name:state.activegraph.graph.name, data:state.activegraph.graph.data}), 'utf-8');

    case 'RESTORE_SESSION_DATA':

      var json = fs.readFileSync(action.payload.filename[0], 'utf-8');
      var sessionData = JSON.parse(json);
      var activegraph = Object.assign({}, state.activegraph, {});

      for (var i = 0; i < state.graphs.length; i++) {
        if (state.graphs[i].name === sessionData.name)  {
          var targetGraph = Object.assign({}, state.graphs[i], {});
          targetGraph.data = sessionData.data;
          targetGraph.filterdata = sessionData.data;
          state.graphs[i] = targetGraph;
          activegraph.graph = Object.assign({}, targetGraph, {});
        }
      }
      return {graphs:state.graphs, activegraph:activegraph};

    default:
      return state;
  }
};

export default graphReducer;
