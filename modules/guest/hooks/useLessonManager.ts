import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useGuest } from './useGuest';

export const useLessonManager = () => {
  const {
    completeLesson,
    loseHeart,
    addHearts,
    hasHearts,
    hasReachedGuestLimit,
    isGuestMode,
    progress,
    error,
    clearGuestError,
  } = useGuest();

  // Handle lesson completion
  const handleLessonComplete = useCallback(async (
    lessonId: string,
    score: number,
    timeSpent: number
  ) => {
    try {
      if (hasReachedGuestLimit()) {
        Alert.alert(
          'Giới hạn khách',
          'Bạn đã hoàn thành 2 bài học miễn phí. Đăng ký để tiếp tục học!',
          [{ text: 'OK' }]
        );
        return false;
      }

      await completeLesson({
        lesson_id: lessonId,
        score,
        time_spent: timeSpent,
      });

      // Show success message
      Alert.alert(
        'Chúc mừng!',
        `Bạn đã hoàn thành bài học với điểm số ${score}!`,
        [{ text: 'Tiếp tục' }]
      );

      return true;
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      Alert.alert('Lỗi', 'Không thể hoàn thành bài học. Vui lòng thử lại.');
      return false;
    }
  }, [completeLesson, hasReachedGuestLimit]);

  // Handle lesson failure (lose heart)
  const handleLessonFailed = useCallback(async () => {
    try {
      if (!hasHearts()) {
        Alert.alert(
          'Hết tim!',
          'Bạn cần xem quảng cáo để nhận thêm tim hoặc đăng ký để có tim không giới hạn.',
          [
            { text: 'Xem quảng cáo', onPress: handleWatchAd },
            { text: 'Để sau', style: 'cancel' }
          ]
        );
        return;
      }

      await loseHeart();
      
      if (!hasHearts()) {
        Alert.alert(
          'Hết tim!',
          'Bạn đã hết tim. Xem quảng cáo để tiếp tục?',
          [
            { text: 'Xem quảng cáo', onPress: handleWatchAd },
            { text: 'Để sau', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Failed to lose heart:', error);
    }
  }, [loseHeart, hasHearts]);

  // Handle watching ad for hearts
  const handleWatchAd = useCallback(async () => {
    try {
      // In a real app, you would integrate with an ad SDK here
      // For now, we'll simulate watching an ad
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await addHearts();
      
      Alert.alert(
        'Thành công!',
        'Bạn đã nhận được thêm tim từ quảng cáo!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to add hearts:', error);
      Alert.alert('Lỗi', 'Không thể thêm tim. Vui lòng thử lại.');
    }
  }, [addHearts]);

  // Check if user can start a lesson
  const canStartLesson = useCallback(() => {
    if (hasReachedGuestLimit()) {
      return {
        canStart: false,
        reason: 'Đã đạt giới hạn bài học cho khách (2 bài)',
        action: 'register'
      };
    }

    if (!hasHearts()) {
      return {
        canStart: false,
        reason: 'Không có tim để chơi',
        action: 'watch_ad'
      };
    }

    return {
      canStart: true,
      reason: 'Có thể bắt đầu bài học',
      action: null
    };
  }, [hasReachedGuestLimit, hasHearts]);

  // Get remaining lessons for guest
  const getRemainingLessons = useCallback(() => {
    if (!isGuestMode) return null;
    
    const completed = progress?.completed_lessons.length || 0;
    return Math.max(0, 2 - completed);
  }, [isGuestMode, progress?.completed_lessons.length]);

  return {
    // Actions
    handleLessonComplete,
    handleLessonFailed,
    handleWatchAd,
    
    // Checks
    canStartLesson,
    getRemainingLessons,
    
    // State
    hasHearts,
    hasReachedGuestLimit,
    isGuestMode,
    progress,
    error,
    clearGuestError,
  };
};
