export interface GuestSession {
  id: string;
  device_id: string;
  created_at: string;
}

export interface GuestProgress {
  hearts: number;
  max_hearts: number;
  completed_lessons: string[];
  unlocked_characters: string[];
}

export interface GuestSessionResponse {
  session: GuestSession;
  progress: GuestProgress;
}

export interface CreateGuestSessionPayload {
  device_id: string;
}

export interface CompleteLessonPayload {
  lesson_id: string;
  score: number;
  time_spent: number;
}

export interface LessonAccessResponse {
  can_access: boolean;
  reason: string;
  hearts_needed: number;
}

export interface HeartsResponse {
  hearts: number;
  max_hearts: number;
}

export interface CompleteLessonResponse {
  hearts: number;
  completed_lessons: string[];
  unlocked_characters: string[];
}
