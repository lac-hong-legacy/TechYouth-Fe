import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface User {
    id: string;
    email: string;
    display_name: string;
    is_active: boolean;
    kratos_identity_id: string;
    user_type: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    expiresIn: number | null;
    loading: boolean;
    error: string | null;
}

interface ForgotPasswordOTPResponse {
    valid: boolean;
    user?: User;
}


const initialState: AuthState = {
    user: null,
    accessToken: null,
    expiresIn: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.expiresIn = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {




    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;