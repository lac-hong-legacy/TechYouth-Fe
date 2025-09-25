import { fetchTimeline, heartUsers, initProfile, loginUser, registerUser, StatsUser, UserProfile } from '@/modules/auth/store/authThunks';
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
    hearts: any | null;
    StatsInfo: any | null;
    profileUser: any | null
}

export interface LoginResponse {
    access_token: string;
    expires_in?: number;
    user?: User;
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
    hearts: null,
    StatsInfo: null,
    profileUser: null,
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
            state.hearts = null;
        },
    },
    extraReducers: (builder) => {
        // Login

        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.loading = false;
            state.accessToken = action.payload.access_token;
            state.expiresIn = action.payload.expires_in ?? null;
            state.user = action.payload.user ?? null;
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

        // handle heartUsers thunk
        builder.addCase(heartUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(heartUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.hearts = action.payload;
        });
        builder.addCase(heartUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder
            .addCase(initProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // dữ liệu trả về từ API init profile
            })
            .addCase(initProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });


        // handle heartUsers thunk
        builder.addCase(fetchTimeline.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTimeline.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchTimeline.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Stats User
        builder.addCase(StatsUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(StatsUser.fulfilled, (state, action) => {
            state.loading = false;
            state.StatsInfo = action.payload;
        });
        builder.addCase(StatsUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // profile User
        builder.addCase(UserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(UserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profileUser = action.payload;
        });
        builder.addCase(UserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;