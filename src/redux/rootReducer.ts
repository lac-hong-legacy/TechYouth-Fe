import authReducer from "@/src/redux/slices/authSlice";
import dynastyReducer from "@/src/redux/slices/dynastySlice";
import timelineReducer from "@/src/redux/slices/timelineSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    auth: authReducer,
    timeline: timelineReducer,
    dynasty: dynastyReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;