import authReducer from "@/modules/auth/store/authSlice";
import guestReducer from "@/modules/guest/store/guestSlice";
import { combineReducers } from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    auth: authReducer,
    guest: guestReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;