import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StartButtonProps {
  selectedCharacterId: string | null;
  onPress: () => void;
}

export const StartButton: React.FC<StartButtonProps> = ({ selectedCharacterId, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.startButton} 
      onPress={onPress}
    >
       <Text style={styles.startButtonText}>BẮT ĐẦU</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  startButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1cb153ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});