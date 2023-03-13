import { ProcessReducer } from "../reducer/processReducer";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
    ProcessReducer: ProcessReducer,
})

export default rootReducers