import { dynasties, eras, fetchCharacterQuiz, fetchDynastyDetail } from '@/modules/auth/store/authThunks';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DynastyState {
    selectedCharacterId: string | null;
    selectedDynastyDetail: any | null;
    quizData: any | null;
    detailLoading: boolean;
    quizLoading: boolean;
    error: string | null;
    quizResult: any | null;
    dynastyList: string[];   // ✅ thêm
    eraList: string[];       // ✅ thêm
    loadingDynasties: boolean; // loading riêng cho dynasties
    loadingEras: boolean;      // loading riêng cho eras
}

const initialState: DynastyState = {
    selectedCharacterId: null,
    selectedDynastyDetail: null,
    quizData: null,
    detailLoading: false,
    quizLoading: false,
    error: null,
    quizResult: null,
    dynastyList: [],
    eraList: [],
    loadingDynasties: false,
    loadingEras: false,
}

export interface DynastyDetailData {
    id: string;
    name: string;
    dynasty: string;
    rarity: string;
    birth_year: number;
    death_year: number;
    description: string;
    // thêm các trường khác nếu cần
}

// Quiz nhân vật
export interface CharacterQuiz {
    id: string;
    character_id: string;
    title: string;
    story: string;
    questions: any[];
}

const dynastySlice = createSlice({
    name: 'dynasty',
    initialState,
    reducers: {
        setSelectedCharacter: (state, action: PayloadAction<string>) => {
            state.selectedCharacterId = action.payload;
            state.selectedDynastyDetail = null;
            state.quizData = null;
            state.quizResult = null;
            state.error = null;
        },
        clearDynastyDetail: (state) => {
            state.selectedDynastyDetail = null;
            state.quizData = null;
            state.quizResult = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setQuizResult: (state, action: PayloadAction<any>) => {
            state.quizResult = action.payload; // ✅ lưu quizResult
        },
    },
    extraReducers: (builder) => {
        // Dynasty Detail
        builder.addCase(fetchDynastyDetail.pending, (state) => { state.detailLoading = true; state.error = null; })
        builder.addCase(fetchDynastyDetail.fulfilled, (state, action) => {
            state.detailLoading = false;
            state.selectedDynastyDetail = action.payload.data; // ✅ lấy data
        });
        builder.addCase(fetchDynastyDetail.rejected, (state, action) => {
            state.detailLoading = false;
            state.error = action.payload as string;
        });

        // Character Quiz
        builder.addCase(fetchCharacterQuiz.pending, (state) => { state.quizLoading = true; state.error = null; })
        builder.addCase(fetchCharacterQuiz.fulfilled, (state, action) => {
            state.quizLoading = false;
            state.quizData = action.payload.data; // ✅ lấy data
        });
        builder.addCase(fetchCharacterQuiz.rejected, (state, action) => {
            state.quizLoading = false;
            state.error = action.payload as string;
        });


        // Dynasties
        builder.addCase(dynasties.pending, (state) => {
            state.loadingDynasties = true;
            state.error = null;
        });
        builder.addCase(dynasties.fulfilled, (state, action) => {
            state.loadingDynasties = false;
            state.dynastyList = action.payload?.data || []; // lấy data từ payload
        });
        builder.addCase(dynasties.rejected, (state, action) => {
            state.loadingDynasties = false;
            state.error = action.payload as string;
        });

        // Eras
        builder.addCase(eras.pending, (state) => {
            state.loadingEras = true;
            state.error = null;
        });
        builder.addCase(eras.fulfilled, (state, action) => {
            state.loadingEras = false;
            state.eraList = action.payload?.data || []; // lấy data từ payload
        });
        builder.addCase(eras.rejected, (state, action) => {
            state.loadingEras = false;
            state.error = action.payload as string;
        });
    },
});

export const { setSelectedCharacter, clearDynastyDetail, clearError, setQuizResult } = dynastySlice.actions;
export default dynastySlice.reducer;