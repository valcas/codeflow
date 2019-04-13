const fs = window.require('fs');

const initialState = {
  graphs: [],
  acivegraph : null
};

const getActiveFilters = (state) => {

  var activegraph = Object.assign({}, state.activegraph, {});
  
  if ( ! activegraph.graph.currentfilter)  {
    activegraph.graph.currentfilter = {};
  }

  return activegraph.graph.currentfilter;

}

const applyFilters = (state, filter) => {

  var returnState = Object.assign({}, state, {});

  var activegraph = Object.assign({}, returnState.activegraph, {});
  var targetGraph = returnState.graphs.filter(g => (g.name === returnState.activegraph.graph.name))[0];

  if (targetGraph && targetGraph.data)  {

    var stepKeys = Object.keys(targetGraph.data);
    
    var filteredData = {};

    stepKeys.map(step => {
      targetGraph.data[step].map(stepData => {

        var addToResults = (filter == null) || (filter.processid == null) || (stepData.processid == filter.processid);
        addToResults = addToResults && ((filter == null) || (filter.searchtext == null) || (filter.searchtext.trim().length === 0) || ((stepData.data) && (stepData.data.indexOf(filter.searchtext) > -1)));
        if (addToResults && (filter.keys) && (filter.keys.length > 0)) {
          var keyMatch = false;
          var stepkeys = stepData.keys ? stepData.keys : [];
          stepkeys.map((key) => {
            filter.keys.map((fKey) => {
              if ((key.id === fKey.id) && (key.value === fKey.value))  {
                keyMatch = true;
              }
            });
          });

          addToResults = addToResults && keyMatch;

          // for (var i = 0; i < stepkeys.length; i++) {
          //   if ((stepkeys[i].id === filter.key.id) && (stepkeys[i].value === filter.key.value))  {
          //     break;
          //   } else {
          //     addToResults = false;
          //   }
          // }
        }

        if (addToResults) {
          if (filteredData[step] == null)  {
            filteredData[step] = [];
          }
          filteredData[step].push(stepData);
        }

      });
    });

    targetGraph.filterdata = filteredData;
    activegraph.graph.filterdata = filteredData;
    targetGraph.currentfilter = filter;
    activegraph.graph.currentfilter = filter;
    targetGraph.selectedresponse = 0;
    activegraph.graph.selectedresponse = 0;

  }

  return {graphs:returnState.graphs, activegraph:activegraph, selectedstep:returnState.selectedstep};

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
      return {graphs:state.graphs, activegraph:state.activegraph, searchtext:state.searchtext};
    case 'DATA_RECEIVED':

	    state.activegraph = state.activegraph ? state.activegraph : {};
      var data = action.payload.data;
      var diagramId = data.diagramid;
      var targetGraph = null;
      var stepid = data.stepid;
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
          stepdata.push({action:data.action, processid:data.processid, data:data.data, timestamp:data.timestamp, keys:data.keys});
          state.graphs[i] = targetGraph;
          targetGraph.filterdata = stepdata;
          if (activegraph.graph.name === diagramId) {
            activegraph.graph.data = targetGraph.data;
            activegraph.graph.filterdata = targetGraph.data;
          }
        }
      }
      return {graphs:state.graphs, activegraph:activegraph, selectedstep:state.selectedstep, searchtext:state.searchtext};

    case 'SET_SELECTED_STEP':

      return {graphs:state.graphs, activegraph:state.activegraph, selectedstep:action.payload.selectedstep, searchtext:state.searchtext};

    case 'FILTER_PROCESS':

      var filter = getActiveFilters(state);
      filter.processid = action.payload.processid;
      return applyFilters(state, filter, state.searchtext);  

    case 'FILTER_KEY':

      var filter = getActiveFilters(state);
      filter.keys = filter.keys ? filter.keys : [];
      filter.keys.push(action.payload.key);
      return applyFilters(state, filter);  

    case 'REMOVE_FILTER_KEY':

      var filter = getActiveFilters(state);
      filter.keys.map((key, index) => {
        if ((key.id === action.payload.key.id) && (key.value === action.payload.key.value)) {
          filter.keys.splice(index, 1);
        }
      });
      return applyFilters(state, filter);  

    case 'SET_SEARCH_TEXT':

      if ( ! state.activegraph) {return state;}
      var filter = getActiveFilters(state);
      filter.searchtext = action.payload;
      return applyFilters(state, filter);  

    case 'REMOVE_FILTER':

        for (var i = 0; i < state.graphs.length; i++) {

          if (state.graphs[i].name === state.activegraph.graph.name)  {
            var graph = state.graphs[i];

      			var activegraph = Object.assign({}, state.activegraph, {});
            var currentFilter = getActiveFilters(state);
            currentFilter.processid = null;
            activegraph.graph.filterdata = activegraph.graph.data;
            graph.filterdata = activegraph.graph.data;
            activegraph.graph.currentfilter = null;
            graph.currentfilter = null;

            return applyFilters(state, currentFilter);  
          }

        }

    case 'SET_SELECTED_RESPONSE':

    var returnState = Object.assign({}, state, {});

    for (var i = 0; i < returnState.graphs.length; i++) {
        
        if (returnState.graphs[i].name === returnState.activegraph.graph.name)  {
          
          var activeFilters = getActiveFilters(state);
          var filterResults = applyFilters(returnState,activeFilters);
          var graph = filterResults.graphs[i];

          var activegraph = Object.assign({}, filterResults.activegraph, {});
          activegraph.graph.currentfilter = activeFilters;
          graph.currentfilter = activeFilters;
          activegraph.graph.selectedresponse = action.payload;
          graph.selectedresponse = action.payload;
          
          return {graphs:filterResults.graphs, activegraph:activegraph, selectedstep:filterResults.selectedstep, searchtext:filterResults.searchtext};
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
      return {graphs:state.graphs, activegraph:activegraph, searchtext:state.searchtext};

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
      return {graphs:state.graphs, activegraph:activegraph, searchtext:state.searchtext};

    default:
      return state;
  }
};

export default graphReducer;
