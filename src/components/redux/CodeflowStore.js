import { combineReducers, createStore } from "redux";
import graphReducer from "./reducers/GraphReducer";
import settingsReducer from "./reducers/SettingsReducer";

const reducers = combineReducers({
  gr:graphReducer,
  sr:settingsReducer
});

const store =  createStore(reducers);

export default store;