import authReducer from "@/modules/auth/store/authSlice";
import dynastyReducer from "@/modules/auth/store/dynastySlice";
import timelineReducer from "@/modules/auth/store/timelineSlice";
import { combineReducers } from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    auth: authReducer,
    timeline: timelineReducer,
    dynasty: dynastyReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;