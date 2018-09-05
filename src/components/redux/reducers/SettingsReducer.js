const initialState = {
  listenport: 8081,
  listening: true
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETTINGS_LOADED':
      return {settings:action.payload};
    case 'SET_LISTENING_STATE':
      var settings = JSON.parse(JSON.stringify(state.settings));
      settings.listening = action.payload;
      return {settings:settings};
    case 'SET_LISTENING_PORT':
      var settings = JSON.parse(JSON.stringify(state.settings));
      settings.listenport = action.payload;
      return {settings:settings};
    default:
      return state;
  }
};

export default settingsReducer;
