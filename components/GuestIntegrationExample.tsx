import { useGuest, useLessonManager } from '@/modules/guest';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressHeader from './ProgressHeader';

/**
 * Complete example showing how to integrate guest functionality
 * This demonstrates the full guest user flow with lesson management
 */
export const GuestIntegrationExample: React.FC = () => {
  const { isGuestMode, progress, loading } = useGuest();
  const {
    handleLessonComplete,
    handleLessonFailed,
    handleWatchAd,
    canStartLesson,
    getRemainingLessons,
  } = useLessonManager();

  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isPlayingLesson, setIsPlayingLesson] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    // Show guest mode status
    if (isGuestMode) {
      const remaining = getRemainingLessons();
      console.log(`Guest mode active. Remaining lessons: ${remaining}`);
    }
  }, [isGuestMode, loading, getRemainingLessons]);

  const startLesson = (lessonId: string) => {
    const { canStart, reason, action } = canStartLesson();
    
    if (!canStart) {
      if (action === 'register') {
        Alert.alert(
          'Cần đăng ký',
          reason,
          [
            { text: 'Đăng ký ngay', onPress: () => console.log('Navigate to registration') },
            { text: 'Để sau', style: 'cancel' }
          ]
        );
      } else if (action === 'watch_ad') {
        Alert.alert(
          'Cần tim',
          reason,
          [
            { text: 'Xem quảng cáo', onPress: handleWatchAd },
            { text: 'Để sau', style: 'cancel' }
          ]
        );
      }
      return;
    }

    setCurrentLesson(lessonId);
    setIsPlayingLesson(true);
  };

  const simulateLessonCompletion = async (success: boolean) => {
    if (!currentLesson) return;

    setIsPlayingLesson(false);

    if (success) {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      const timeSpent = Math.floor(Math.random() * 300) + 120; // 2-7 minutes
      
      const completed = await handleLessonComplete(currentLesson, score, timeSpent);
      
      if (completed) {
        const remaining = getRemainingLessons();
        if (remaining === 0) {
          Alert.alert(
            'Hoàn thành!',
            'Bạn đã hoàn thành tất cả bài học miễn phí. Đăng ký để tiếp tục!',
            [{ text: 'Đăng ký ngay', onPress: () => console.log('Navigate to registration') }]
          );
        }
      }
    } else {
      await handleLessonFailed();
    }

    setCurrentLesson(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <ProgressHeader />

      <View style={styles.content}>
        <Text style={styles.title}>Ví dụ Tích hợp Guest Mode</Text>

        {/* Guest Status */}
        {isGuestMode && (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Trạng thái Khách</Text>
            <Text style={styles.statusText}>
              Bài học đã hoàn thành: {progress?.completed_lessons.length || 0}/2
            </Text>
            <Text style={styles.statusText}>
              Nhân vật đã mở khóa: {progress?.unlocked_characters.length || 0}
            </Text>
            <Text style={styles.statusText}>
              Còn lại: {getRemainingLessons()} bài học miễn phí
            </Text>
          </View>
        )}

        {/* Lesson Buttons */}
        <View style={styles.lessonSection}>
          <Text style={styles.sectionTitle}>Bài học có sẵn</Text>
          
          {['lesson-1', 'lesson-2', 'lesson-3'].map((lessonId, index) => {
            const isCompleted = progress?.completed_lessons.includes(lessonId);
            const { canStart } = canStartLesson();
            const isDisabled = !canStart && !isCompleted;
            
            return (
              <TouchableOpacity
                key={lessonId}
                style={[
                  styles.lessonButton,
                  isCompleted && styles.completedLesson,
                  isDisabled && styles.disabledLesson,
                ]}
                onPress={() => startLesson(lessonId)}
                disabled={isDisabled && !isCompleted}
              >
                <Text style={[
                  styles.lessonButtonText,
                  isCompleted && styles.completedLessonText,
                  isDisabled && styles.disabledLessonText,
                ]}>
                  Bài học {index + 1} {isCompleted ? '✓' : ''}
                  {index >= 2 && isGuestMode && !isCompleted ? ' (Cần đăng ký)' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lesson Simulation */}
        {isPlayingLesson && currentLesson && (
          <View style={styles.simulationCard}>
            <Text style={styles.simulationTitle}>Đang chơi: {currentLesson}</Text>
            <Text style={styles.simulationText}>Mô phỏng bài học...</Text>
            
            <View style={styles.simulationButtons}>
              <TouchableOpacity
                style={[styles.simulationButton, styles.successButton]}
                onPress={() => simulateLessonCompletion(true)}
              >
                <Text style={styles.simulationButtonText}>Hoàn thành</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.simulationButton, styles.failButton]}
                onPress={() => simulateLessonCompletion(false)}
              >
                <Text style={styles.simulationButtonText}>Thất bại</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleWatchAd}
          >
            <Text style={styles.actionButtonText}>Xem quảng cáo (+Tim)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  lessonSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  lessonButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  completedLesson: {
    backgroundColor: '#28A745',
  },
  disabledLesson: {
    backgroundColor: '#CCC',
  },
  lessonButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completedLessonText: {
    color: 'white',
  },
  disabledLessonText: {
    color: '#666',
  },
  simulationCard: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#FFEAA7',
    borderWidth: 1,
  },
  simulationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#856404',
  },
  simulationText: {
    fontSize: 14,
    marginBottom: 15,
    color: '#856404',
  },
  simulationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  simulationButton: {
    padding: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#28A745',
  },
  failButton: {
    backgroundColor: '#DC3545',
  },
  simulationButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#FFA502',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GuestIntegrationExample;
