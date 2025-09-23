import { ENV } from "@/config/env";
import axios from "axios";
import {
    CompleteLessonPayload,
    CompleteLessonResponse,
    CreateGuestSessionPayload,
    GuestProgress,
    GuestSessionResponse,
    HeartsResponse,
    LessonAccessResponse,
} from "../types";

export const guestService = {
  async createSession(data: CreateGuestSessionPayload): Promise<GuestSessionResponse> {
    try {
      const response = await axios.post(
        `${ENV.API_URL}/api/v1/guest/session`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      return response.data.data as GuestSessionResponse;
    } catch (error: any) {
      console.error("Create guest session error:", error.response?.data || error.message);
      throw error;
    }
  },

  async getProgress(sessionId: string): Promise<GuestProgress> {
    try {
      const response = await axios.get(
        `${ENV.API_URL}/api/v1/guest/session/${sessionId}/progress`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );

      return response.data.data as GuestProgress;
    } catch (error: any) {
      console.error("Get guest progress error:", error.response?.data || error.message);
      throw error;
    }
  },

  async checkLessonAccess(sessionId: string, lessonId: string): Promise<LessonAccessResponse> {
    try {
      const response = await axios.get(
        `${ENV.API_URL}/api/v1/guest/session/${sessionId}/lesson/${lessonId}/access`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );

      return response.data.data as LessonAccessResponse;
    } catch (error: any) {
      console.error("Check lesson access error:", error.response?.data || error.message);
      throw error;
    }
  },

  async completeLesson(sessionId: string, data: CompleteLessonPayload): Promise<CompleteLessonResponse> {
    try {
      const response = await axios.post(
        `${ENV.API_URL}/api/v1/guest/session/${sessionId}/lesson/complete`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      return response.data.data as CompleteLessonResponse;
    } catch (error: any) {
      console.error("Complete lesson error:", error.response?.data || error.message);
      throw error;
    }
  },

  async addHearts(sessionId: string): Promise<HeartsResponse> {
    try {
      const response = await axios.post(
        `${ENV.API_URL}/api/v1/guest/session/${sessionId}/hearts/add`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      return response.data.data as HeartsResponse;
    } catch (error: any) {
      console.error("Add hearts error:", error.response?.data || error.message);
      throw error;
    }
  },

  async loseHeart(sessionId: string): Promise<HeartsResponse> {
    try {
      const response = await axios.post(
        `${ENV.API_URL}/api/v1/guest/session/${sessionId}/hearts/lose`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      return response.data.data as HeartsResponse;
    } catch (error: any) {
      console.error("Lose heart error:", error.response?.data || error.message);
      throw error;
    }
  },
};
