import { authService, LoginPayLoad, RegisterPayload } from "@/modules/auth/service/authService";
import { contentService } from "@/modules/auth/service/contentService";
import { dynastyService } from '@/modules/auth/service/dynastyService';
import { InitProfilePayload, userService } from "@/modules/auth/service/userService";
import { LoginResponse, User } from "@/modules/auth/store/authSlice";
import { CharacterQuiz, DynastyDetailData } from "@/modules/auth/store/dynastySlice";
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
export const loginUser = createAsyncThunk<LoginResponse, LoginPayLoad>(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await authService.login(data);
            return res;
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


// user/hearts
export const heartUsers = createAsyncThunk(
    "user/fetchHearts",
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.hearts();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

// user/initProfile
export const initProfile = createAsyncThunk(
    "user/initProfile",
    async (payload: InitProfilePayload, { rejectWithValue }) => {
        try {
            const data = await userService.initProfile(payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)


export const fetchTimeline = createAsyncThunk(
    "contant/contents",
    async (_, { rejectWithValue }) => {
        try {
            const data = await contentService.content();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)



// Fetch dynasty detail
export const fetchDynastyDetail = createAsyncThunk(
    "dynasty/fetchDynastyDetail",
    async (characterId: string, { rejectWithValue }) => {
        try {
            const response = await dynastyService.getDynastyDetail(characterId);
            return { data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch character quiz
export const fetchCharacterQuiz = createAsyncThunk<{ characterId: string; data: CharacterQuiz[] }, string, { rejectValue: string }>(
    "dynasty/fetchCharacterQuiz",
    async (characterId, { rejectWithValue }) => {
        try {
            const response = await dynastyService.getCharacterQuiz(characterId);
            return { characterId, data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


