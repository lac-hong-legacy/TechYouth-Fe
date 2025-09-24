import { createAsyncThunk } from '@reduxjs/toolkit';
import { guestService } from '../service/guestService';
import {
    CompleteLessonPayload,
    CompleteLessonResponse,
    CreateGuestSessionPayload,
    GuestProgress,
    GuestSessionResponse,
    HeartsResponse,
    LessonAccessResponse,
} from '../types';
import { getOrCreateDeviceId, storeGuestSession } from '../utils/deviceUtils';

// Create Guest Session
export const createGuestSession = createAsyncThunk<
  GuestSessionResponse,
  void,
  { rejectValue: string }
>(
  'guest/createSession',
  async (_, { rejectWithValue }) => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const payload: CreateGuestSessionPayload = { device_id: deviceId };
      
      const response = await guestService.createSession(payload);
      
      // Store session ID locally
      await storeGuestSession(response.session.id);
      
      return response;
    } catch (error: any) {
      if (error.response) {
        console.log("❌ Create guest session error:", error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to create guest session');
      }
      return rejectWithValue(error.message || 'Failed to create guest session');
    }
  }
);

// Get Guest Progress
export const getGuestProgress = createAsyncThunk<
  GuestProgress,
  string,
  { rejectValue: string }
>(
  'guest/getProgress',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await guestService.getProgress(sessionId);
    } catch (error: any) {
      if (error.response) {
        console.log("❌ Get guest progress error:", error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to get progress');
      }
      return rejectWithValue(error.message || 'Failed to get progress');
    }
  }
);

// Check Lesson Access
export const checkGuestLessonAccess = createAsyncThunk<
  { lessonId: string; accessData: LessonAccessResponse },
  { sessionId: string; lessonId: string },
  { rejectValue: string }
>(
  'guest/checkLessonAccess',
  async ({ sessionId, lessonId }, { rejectWithValue }) => {
    try {
      const accessData = await guestService.checkLessonAccess(sessionId, lessonId);
      return { lessonId, accessData };
    } catch (error: any) {
      if (error.response) {
        console.log("❌ Check lesson access error:", error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to check lesson access');
      }
      return rejectWithValue(error.message || 'Failed to check lesson access');
    }
  }
);

// Complete Lesson
export const completeGuestLesson = createAsyncThunk<
  CompleteLessonResponse,
  { sessionId: string; lessonData: CompleteLessonPayload },
  { rejectValue: string }
>(
  'guest/completeLesson',
  async ({ sessionId, lessonData }, { rejectWithValue }) => {
    try {
      return await guestService.completeLesson(sessionId, lessonData);
    } catch (error: any) {
      if (error.response) {
        console.log("❌ Complete lesson error:", error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to complete lesson');
      }
      return rejectWithValue(error.message || 'Failed to complete lesson');
    }
  }
);

// Add Hearts (from watching ads)
export const addGuestHearts = createAsyncThunk<
  HeartsResponse,
  string,
  { rejectValue: string }
>(
  'guest/addHearts',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await guestService.addHearts(sessionId);
    } catch (error: any) {
      if (error.response) {
        console.log("❌ Add hearts error:", error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to add hearts');
      }
      return rejectWithValue(error.message || 'Failed to add hearts');
    }
  }
);

// Lose Heart (failed lesson)
export const loseGuestHeart = createAsyncThunk<
  HeartsResponse,
  string,
  { rejectValue: string }
>(
  'guest/loseHeart',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await guestService.loseHeart(sessionId);
    } catch (error: any) {
      if (error.response) {
        console.log("❌ Lose heart error:", error.response.data);
        return rejectWithValue(error.response.data.message || 'Failed to lose heart');
      }
      return rejectWithValue(error.message || 'Failed to lose heart');
    }
  }
);
