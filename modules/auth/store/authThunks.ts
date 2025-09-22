import { RegisterPayload, authService, LoginPayLoad } from "@/modules/auth/service/authService";
import { User } from "@/modules/auth/store/authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";


// register
export const registerUser = createAsyncThunk<User, RegisterPayload>(
    "auth/registerUser",

    async (data, { rejectWithValue }) => {
        try {
            return await authService.register(data);
        } catch (err: any) {
            // const error = err as AxiosError<{ error?: { message?: string } }>;
            // return rejectWithValue(error.response?.data?.error?.message || error.message || "Registration failed");
            if (err.response) {
                console.log("❌ Chi tiết lỗi từ server:", err.response.data);
                return rejectWithValue(err.response.data);
            }
            console.log("❌ Lỗi không xác định:", err.message);
            return rejectWithValue(err.message);
        }
    }
);

// Login
export const loginUser = createAsyncThunk<User, LoginPayLoad>(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            return await authService.login(data);
        } catch (err: any) {
            if (err.response) {
                console.log("❌ Chi tiết lỗi từ server:", err.response.data);
                return rejectWithValue(err.response.data);
            }
            console.log("❌ Lỗi không xác định:", err.message);
            return rejectWithValue(err.message);
        }

    }
)