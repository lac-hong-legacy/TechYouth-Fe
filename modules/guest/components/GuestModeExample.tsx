import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGuest } from '../hooks/useGuest';

/**
 * Example component demonstrating how to use the guest functionality
 * This can be used as a reference for implementing guest features in your app
 */
export const GuestModeExample: React.FC = () => {
  const {
    session,
    progress,
    loading,
    error,
    isGuestMode,
    initializeGuestSession,
    completeLesson,
    checkLessonAccess,
    addHearts,
    loseHeart,
    refreshProgress,
    exitGuestMode,
    clearGuestError,
    hasReachedGuestLimit,
    hasHearts,
    isLessonAccessible,
  } = useGuest();

  useEffect(() => {
    // Initialize guest session when component mounts
    initializeGuestSession();
  }, [initializeGuestSession]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearGuestError();
    }
  }, [error, clearGuestError]);

  const handleCompleteLesson = () => {
    completeLesson({
      lesson_id: 'example-lesson-1',
      score: 85,
      time_spent: 300,
    });
  };

  const handleCheckLessonAccess = () => {
    checkLessonAccess('example-lesson-2');
  };

  const handleWatchAd = () => {
    // Simulate watching an ad
    addHearts();
  };

  const handleFailLesson = () => {
    loseHeart();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest Mode Example</Text>
      
      {isGuestMode && session && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Info</Text>
          <Text>Session ID: {session.id}</Text>
          <Text>Device ID: {session.device_id}</Text>
          <Text>Created: {new Date(session.created_at).toLocaleDateString()}</Text>
        </View>
      )}

      {progress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <Text>Hearts: {progress.hearts}/{progress.max_hearts}</Text>
          <Text>Completed Lessons: {progress.completed_lessons.length}</Text>
          <Text>Unlocked Characters: {progress.unlocked_characters.length}</Text>
          <Text>Guest Limit Reached: {hasReachedGuestLimit() ? 'Yes' : 'No'}</Text>
          <Text>Has Hearts: {hasHearts() ? 'Yes' : 'No'}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCompleteLesson}
          disabled={!hasHearts() || hasReachedGuestLimit()}
        >
          <Text style={styles.buttonText}>Complete Lesson</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCheckLessonAccess}
        >
          <Text style={styles.buttonText}>Check Lesson Access</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleWatchAd}
          disabled={hasHearts() && progress?.hearts === progress?.max_hearts}
        >
          <Text style={styles.buttonText}>Watch Ad (+Hearts)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleFailLesson}
          disabled={!hasHearts()}
        >
          <Text style={styles.buttonText}>Fail Lesson (-Heart)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={refreshProgress}
        >
          <Text style={styles.buttonText}>Refresh Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]} 
          onPress={exitGuestMode}
        >
          <Text style={styles.buttonText}>Exit Guest Mode</Text>
        </TouchableOpacity>
      </View>

      {hasReachedGuestLimit() && (
        <View style={styles.warningSection}>
          <Text style={styles.warningText}>
            You've reached the guest limit! Please register to continue learning.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  warningSection: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    borderColor: '#FFEAA7',
    borderWidth: 1,
  },
  warningText: {
    color: '#856404',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
