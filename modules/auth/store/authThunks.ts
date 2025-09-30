import { authService, LoginPayLoad, RegisterPayload } from "@/modules/auth/service/authService";
import { contentService } from "@/modules/auth/service/contentService";
import { dynastyService } from '@/modules/auth/service/dynastyService';
import { InitProfilePayload, userService } from "@/modules/auth/service/userService";
import { LoginResponse, User } from "@/modules/auth/store/authSlice";
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

// user/stats
export const StatsUser = createAsyncThunk(
    "user/StatsUser",
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.StatsUser();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
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

// user/profile
export const UserProfile = createAsyncThunk(
    "user/UserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.userProfilee();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchUserCollection = createAsyncThunk(
    'auth/fetchUserCollection',
    async (_, { rejectWithValue }) => {
        try {
            const collection = await userService.userCollection();
            return collection; // trả về payload cho slice
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// user/AddheartUsers
export const AddheartUsers = createAsyncThunk(
    "user/AddheartUsers",
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.Addhearts();
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
export const fetchCharacterQuiz = createAsyncThunk(
    "dynasty/fetchCharacterQuiz",
    async (characterId: string, { rejectWithValue }) => {
        try {
            const response = await dynastyService.getCharacterQuiz(characterId);
            return { data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const validateLessonAnswer = createAsyncThunk(
    "dynasty/validateLessonAnswer",
    async ({ lesson_id, question_id, answer }: { lesson_id: string, question_id: string, answer: string }, { rejectWithValue }) => {
        try {
            const response = await dynastyService.validateLessonAnswer(lesson_id, question_id, answer);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const loses = createAsyncThunk(
    "dynasty/loses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await dynastyService.lose();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const dynasties = createAsyncThunk(
    "dynastie/dynasties",
    async (_, { rejectWithValue }) => {
        try {
            const response = await dynastyService.getDynasties();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const eras = createAsyncThunk(
    "dynasties/eras",
    async (_, { rejectWithValue }) => {
        try {
            const response = await dynastyService.getEras();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

