import { useGuest } from '@/modules/guest';
import { useAppSelector } from '@/modules/hooks/useAppDispatch';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressHeaderProps {
  style?: any;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ style }) => {
  const { progress, isGuestMode } = useGuest();
  const { user } = useAppSelector((state) => state.auth);

  // Determine if user is authenticated
  const isAuthenticated = !!user;

  // Hearts logic
  const hearts = progress?.hearts ?? 5;
  const maxHearts = progress?.max_hearts ?? 5;
  
  // XP, Level, and Streak logic
  let xp = 0;
  let level = 1;
  let streak = 0;

  if (isAuthenticated) {
    // For registered users, these would come from user progress API
    // TODO: Implement user progress API calls
    xp = 0; // user.xp || 0;
    level = 1; // user.level || 1;
    streak = 0; // user.streak || 0;
  } else if (isGuestMode && progress) {
    // For guests, calculate basic progress
    xp = progress.completed_lessons.length * 100;
    level = Math.floor(xp / 500) + 1;
    streak = 0; // Guests don't have streaks
  }

  const renderHearts = () => {
    const heartElements = [];
    for (let i = 0; i < maxHearts; i++) {
      heartElements.push(
        <Text key={i} style={[styles.heart, i < hearts ? styles.heartFull : styles.heartEmpty]}>
          ♥
        </Text>
      );
    }
    return heartElements;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Hearts Section */}
      <View style={styles.section}>
        <View style={styles.heartsContainer}>
          {renderHearts()}
        </View>
        <Text style={styles.label}>Tim</Text>
      </View>

      {/* XP Section */}
      <View style={styles.section}>
        <Text style={styles.value}>{xp}</Text>
        <Text style={styles.label}>XP</Text>
      </View>

      {/* Level Section */}
      <View style={styles.section}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelValue}>{level}</Text>
        </View>
        <Text style={styles.label}>Cấp</Text>
      </View>

      {/* Streak Section */}
      <View style={styles.section}>
        <View style={styles.streakContainer}>
          <Text style={styles.streakValue}>{streak}</Text>
          <Text style={styles.streakIcon}>🔥</Text>
        </View>
        <Text style={styles.label}>Chuỗi</Text>
      </View>

      {/* Guest Mode Indicator */}
      {isGuestMode && (
        <View style={styles.guestIndicator}>
          <Text style={styles.guestText}>Khách</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    alignItems: 'center',
    flex: 1,
  },
  heartsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  heart: {
    fontSize: 16,
    marginHorizontal: 1,
  },
  heartFull: {
    color: '#FF4757',
  },
  heartEmpty: {
    color: '#DDD',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  levelContainer: {
    backgroundColor: '#4834D4',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginRight: 4,
  },
  streakIcon: {
    fontSize: 14,
  },
  guestIndicator: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#FFA502',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  guestText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ProgressHeader;
