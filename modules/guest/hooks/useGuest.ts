import { useAppDispatch } from '@/modules/hooks/useAppDispatch';
import { RootState } from '@/modules/store/rootReducer';
import { AuthContext } from '@/rootNavigator/AuthContext';
import { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { clearError, clearGuestData, setGuestMode } from '../store/guestSlice';
import {
  addGuestHearts,
  checkGuestLessonAccess,
  completeGuestLesson,
  createGuestSession,
  getGuestProgress,
  loseGuestHeart,
} from '../store/guestThunks';
import { CompleteLessonPayload } from '../types';
import { clearGuestSession, getStoredGuestSession } from '../utils/deviceUtils';

export const useGuest = () => {
  const dispatch = useAppDispatch();
  const guestState = useSelector((state: RootState) => state.guest);
  const { setGuestMode: setAuthGuestMode } = useContext(AuthContext);

  // Initialize guest session
  const initializeGuestSession = useCallback(async () => {
    try {
      // Check if we already have a stored session
      const storedSessionId = await getStoredGuestSession();
      
      if (storedSessionId && !guestState.session) {
        // Try to get progress for existing session
        dispatch(getGuestProgress(storedSessionId));
        dispatch(setGuestMode(true));
        setAuthGuestMode(true); // Sync with AuthContext
      } else if (!storedSessionId) {
        // Create new guest session
        const result = await dispatch(createGuestSession());
        if (result.meta.requestStatus === 'fulfilled') {
          dispatch(setGuestMode(true));
          setAuthGuestMode(true); // Sync with AuthContext
        }
      }
    } catch (error) {
      console.error('Error initializing guest session:', error);
      // Create new session if there's an error
      const result = await dispatch(createGuestSession());
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(setGuestMode(true));
        setAuthGuestMode(true); // Sync with AuthContext
      }
    }
  }, [dispatch, guestState.session, setAuthGuestMode]);

  // Complete a lesson
  const completeLesson = useCallback((lessonData: CompleteLessonPayload) => {
    if (guestState.session?.id) {
      dispatch(completeGuestLesson({
        sessionId: guestState.session.id,
        lessonData,
      }));
    }
  }, [dispatch, guestState.session?.id]);

  // Check if user can access a lesson
  const checkLessonAccess = useCallback((lessonId: string) => {
    if (guestState.session?.id) {
      dispatch(checkGuestLessonAccess({
        sessionId: guestState.session.id,
        lessonId,
      }));
    }
  }, [dispatch, guestState.session?.id]);

  // Add hearts (from watching ads)
  const addHearts = useCallback(() => {
    if (guestState.session?.id) {
      dispatch(addGuestHearts(guestState.session.id));
    }
  }, [dispatch, guestState.session?.id]);

  // Lose a heart (failed lesson)
  const loseHeart = useCallback(() => {
    if (guestState.session?.id) {
      dispatch(loseGuestHeart(guestState.session.id));
    }
  }, [dispatch, guestState.session?.id]);

  // Refresh progress
  const refreshProgress = useCallback(() => {
    if (guestState.session?.id) {
      dispatch(getGuestProgress(guestState.session.id));
    }
  }, [dispatch, guestState.session?.id]);

  // Clear guest data and exit guest mode
  const exitGuestMode = useCallback(async () => {
    await clearGuestSession();
    dispatch(clearGuestData());
    setAuthGuestMode(false); // Sync with AuthContext
  }, [dispatch, setAuthGuestMode]);

  // Clear error
  const clearGuestError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if lesson is accessible
  const isLessonAccessible = useCallback((lessonId: string) => {
    const accessInfo = guestState.lessonAccess[lessonId];
    return accessInfo?.can_access ?? false;
  }, [guestState.lessonAccess]);

  // Get lesson access info
  const getLessonAccessInfo = useCallback((lessonId: string) => {
    return guestState.lessonAccess[lessonId] || null;
  }, [guestState.lessonAccess]);

  // Check if user has completed maximum guest lessons (2 lessons)
  const hasReachedGuestLimit = useCallback(() => {
    return (guestState.progress?.completed_lessons.length ?? 0) >= 2;
  }, [guestState.progress?.completed_lessons]);

  // Check if user has hearts
  const hasHearts = useCallback(() => {
    return (guestState.progress?.hearts ?? 0) > 0;
  }, [guestState.progress?.hearts]);

  return {
    // State
    session: guestState.session,
    progress: guestState.progress,
    loading: guestState.loading,
    error: guestState.error,
    isGuestMode: guestState.isGuestMode,
    lessonAccess: guestState.lessonAccess,

    // Actions
    initializeGuestSession,
    completeLesson,
    checkLessonAccess,
    addHearts,
    loseHeart,
    refreshProgress,
    exitGuestMode,
    clearGuestError,

    // Helpers
    isLessonAccessible,
    getLessonAccessInfo,
    hasReachedGuestLimit,
    hasHearts,
  };
};
