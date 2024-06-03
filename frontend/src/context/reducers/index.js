import { combineReducers } from "redux";
import userReducer from "./userReducer";
import userCountReducer from "./userCountReducer";
import userListReducer from "./userListReducer";
import userRoleReducer from "./userRoleReducer";
import cartReducer from "./cartReducer";
import productReducer from "./productReducer";

const rootReducer = combineReducers({
  user: userReducer, userCount: userCountReducer, userList: userListReducer, roleType: userRoleReducer, cart: cartReducer, product: productReducer,
});

export default rootReducer;
