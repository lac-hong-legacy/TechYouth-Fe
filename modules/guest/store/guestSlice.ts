import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuestProgress, GuestSession } from '../types';

export interface GuestState {
  session: GuestSession | null;
  progress: GuestProgress | null;
  loading: boolean;
  error: string | null;
  isGuestMode: boolean;
  lessonAccess: {
    [lessonId: string]: {
      can_access: boolean;
      reason: string;
      hearts_needed: number;
    };
  };
}

const initialState: GuestState = {
  session: null,
  progress: null,
  loading: false,
  error: null,
  isGuestMode: false,
  lessonAccess: {},
};

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setGuestMode: (state, action: PayloadAction<boolean>) => {
      state.isGuestMode = action.payload;
    },
    clearGuestData: (state) => {
      state.session = null;
      state.progress = null;
      state.error = null;
      state.isGuestMode = false;
      state.lessonAccess = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Guest Session
    builder.addCase('guest/createSession/pending', (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase('guest/createSession/fulfilled', (state, action: any) => {
      state.loading = false;
      state.session = action.payload.session;
      state.progress = action.payload.progress;
      state.isGuestMode = true;
    });
    builder.addCase('guest/createSession/rejected', (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create guest session';
    });

    // Get Guest Progress
    builder.addCase('guest/getProgress/pending', (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase('guest/getProgress/fulfilled', (state, action: any) => {
      state.loading = false;
      state.progress = action.payload;
    });
    builder.addCase('guest/getProgress/rejected', (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to get guest progress';
    });

    // Check Lesson Access
    builder.addCase('guest/checkLessonAccess/pending', (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase('guest/checkLessonAccess/fulfilled', (state, action: any) => {
      state.loading = false;
      const { lessonId, accessData } = action.payload;
      state.lessonAccess[lessonId] = accessData;
    });
    builder.addCase('guest/checkLessonAccess/rejected', (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to check lesson access';
    });

    // Complete Lesson
    builder.addCase('guest/completeLesson/pending', (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase('guest/completeLesson/fulfilled', (state, action: any) => {
      state.loading = false;
      if (state.progress) {
        state.progress.hearts = action.payload.hearts;
        state.progress.completed_lessons = action.payload.completed_lessons;
        state.progress.unlocked_characters = action.payload.unlocked_characters;
      }
    });
    builder.addCase('guest/completeLesson/rejected', (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to complete lesson';
    });

    // Add Hearts
    builder.addCase('guest/addHearts/pending', (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase('guest/addHearts/fulfilled', (state, action: any) => {
      state.loading = false;
      if (state.progress) {
        state.progress.hearts = action.payload.hearts;
        state.progress.max_hearts = action.payload.max_hearts;
      }
    });
    builder.addCase('guest/addHearts/rejected', (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to add hearts';
    });

    // Lose Heart
    builder.addCase('guest/loseHeart/pending', (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase('guest/loseHeart/fulfilled', (state, action: any) => {
      state.loading = false;
      if (state.progress) {
        state.progress.hearts = action.payload.hearts;
        state.progress.max_hearts = action.payload.max_hearts;
      }
    });
    builder.addCase('guest/loseHeart/rejected', (state, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to lose heart';
    });
  },
});

export const { setGuestMode, clearGuestData, clearError } = guestSlice.actions;
export default guestSlice.reducer;
