import { Book } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LessonCardProps {
  currentItem: any;
  onPress: () => void;
}

export const LessonCard = ({ currentItem, onPress }: LessonCardProps) => {
  return (
    <TouchableOpacity 
      style={[lessonCardStyles.lessonCard, { backgroundColor: currentItem.color || '#207d5eff' }]} 
      onPress={onPress}
    >
      <View style={lessonCardStyles.lessonHeader}>
        <View style={lessonCardStyles.lessonContent}>
          <Text style={lessonCardStyles.lessonCategory}>
            {currentItem.isMainDynasty ? 'GIAI ĐOẠN LỊCH SỬ' : 'SỰ KIỆN'}
          </Text>
          <Text style={lessonCardStyles.lessonTitle}>
            {currentItem.name || "Lịch sử Việt Nam"}
          </Text>
          <Text style={lessonCardStyles.lessonDescription}>
            {currentItem.description || "Tìm hiểu lịch sử dân tộc Việt Nam"}
          </Text>
        </View>
        <Book size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const lessonCardStyles = StyleSheet.create({
  lessonCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lessonContent: {
    flex: 1,
    marginRight: 16,
  },
  lessonCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});