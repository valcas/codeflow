import { combineReducers, createStore } from "redux";
import graphReducer from "./reducers/GraphReducer";
import settingsReducer from "./reducers/SettingsReducer";

const reducers = combineReducers({
  gr:graphReducer,
  sr:settingsReducer
});

const store =  createStore(reducers);
console.log(store.getState().validationsets);

export default store;

// export default store;
