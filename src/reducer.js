/* reducer */
import { combineReducers } from "redux";
import auth from "./authentication/reducer";
import sidepanelReducers from "./components/SidePanel/reducer";
import messagesReducers from "./components/Messages/reducer";

const rootReducer = combineReducers({
  auth,
  ...sidepanelReducers,
  ...messagesReducers
});

export default rootReducer;
