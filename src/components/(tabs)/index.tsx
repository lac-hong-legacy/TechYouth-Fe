import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { setCurrentLesson, setSelectedCharacterId } from '@/src/redux/slices/timelineSlice';
import { heartUsers } from '@/src/redux/thunks/authThunks';
import { DynastyButton } from '@/src/screens/Home/components/DynastyButton';
import { Header } from '@/src/screens/Home/components/Header';
import { LessonCard } from '@/src/screens/Home/components/LessonCard';
import { StartButton } from '@/src/screens/Home/components/StartButton';
import { useTimeline } from '@/src/screens/Home/hooks/useTimelineData';
import { getAllItems } from '@/src/screens/Home/utils/timelineUtils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

type RootStackParamList = {
  Quiz: { characterId: string }
};

export default function VietnamHistoryApp() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    hearts,
    error,
    selectedCharacterId,
    dynasties,
    currentLesson,
    loading,
    refreshing,
    modalVisible,
    modalData,
    onRefresh,
    handleShowCharacterDetail,
    setModalVisible,
  } = useTimeline();

  const allItems = getAllItems(dynasties);
  const currentItem = allItems[currentLesson] || {};

  const handleStartQuiz = async () => {
    if (!selectedCharacterId) {
      Alert.alert('Thông báo', 'Vui lòng chọn một sự kiện để bắt đầu Quiz');
      return;
    }
    try {
      const updatedHearts = await dispatch(heartUsers()).unwrap();
      const heartsCount = updatedHearts.data?.hearts || 0;

      if (heartsCount === 0) {
        Alert.alert(
          'Hết lửa hy vọng',
          'Bạn đã sử đang hết ngọn lửa hy vọng! Vui lòng đợi ngọn lửa hồi hoặc có thể xem quản cáo.',
          [{ text: 'OK' }]
        );
        return;
      }

      navigation.navigate('Quiz', { characterId: selectedCharacterId });
    } catch (err) {
      console.log('Lỗi fetch hearts:', err);
      Alert.alert('Lỗi', 'Không thể kiểm tra tim hiện tại');
    }
  };

  const handleDynastyPress = (item: any, index: number) => {
    dispatch(setCurrentLesson(index));
    if (item.isCharacter) {
      dispatch(setSelectedCharacterId(item.id));
    } else if (item.characters && item.characters.length > 0) {
      dispatch(setSelectedCharacterId(item.characters[0].id));
    } else {
      Alert.alert('Thông báo', 'Sự kiện này chưa có Quiz.');
    }
  };

  if (loading && dynasties.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3542ff" />

      <Header
        currentColor={currentItem.color || '#10B981'}
        hearts={hearts?.data?.hearts || 0}
        loading={loading}
        error={error}
      />

      <LessonCard
        currentItem={currentItem}
        onPress={handleShowCharacterDetail}
      />

      <StartButton
        selectedCharacterId={selectedCharacterId}
        onPress={handleStartQuiz}
      />

      <ScrollView
        style={styles.timeline}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.timelineContainer}>
          {allItems.map((item, index) => (
            <DynastyButton
              key={`${item.id || item.parentId || 'item'}-${index}`}
              item={item}
              index={index}
              isActive={currentLesson === index}
              onPress={() => handleDynastyPress(item, index)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4ecd8"
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeline: {
    flex: 1,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    position: 'relative',
  },
})