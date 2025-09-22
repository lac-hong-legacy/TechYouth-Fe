import { registerUser, loginUser } from '@/modules/auth/store/authThunks';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface User {
    id: string;
    email: string;
    display_name: string;
    is_active: boolean;
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
        // Login

        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.accessToken = action.payload.data.access_token;
            state.expiresIn = action.payload.data.expires_in;
            state.user = action.payload.data.user;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Login failed";
        });

        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || action.error.message || "Register failed";
        });


    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;