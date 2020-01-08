/* reducer */
import { combineReducers } from "redux";
import auth from "./authentication/reducer";
import sidepanelReducers from "./components/SidePanel/reducer";

const { channels, currentChannel, starred, users } = sidepanelReducers;

const rootReducer = combineReducers({
  auth,
  users,
  channels,
  currentChannel,
  starred
});

export default rootReducer;
