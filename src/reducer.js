/* reducer */
import { combineReducers } from "redux";
import auth from "./authentication/reducer";
import sidepanelReducers from "./components/SidePanel/reducer";
import messages from "./components/Messages/reducer";

const {
  channels,
  currentChannel,
  starred,
  users,
  unreadMessages
} = sidepanelReducers;

const rootReducer = combineReducers({
  auth,
  users,
  channels,
  currentChannel,
  starred,
  unreadMessages,
  messages
});

export default rootReducer;
