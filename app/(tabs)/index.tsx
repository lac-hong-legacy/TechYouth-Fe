import { fetchDynastyDetail, fetchTimeline, heartUsers } from '@/modules/auth/store/authThunks';
import { setCurrentLesson, setSelectedCharacterId } from '@/modules/auth/store/timelineSlice';
import { useAppDispatch, useAppSelector } from '@/modules/hooks/useAppDispatch';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Book, Building, Castle, Crown, Flag, Flame, Gavel, Scroll, Shield, Star, Swords, Users } from 'lucide-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { width } = Dimensions.get('window');
type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Welcome: undefined;
  NotFound: undefined;
  Tabs: undefined;
  Quiz: { characterId: string }
  characterModal: { characterId: string }
};

const iconMap = { 'castle': Castle, 'shield': Shield, 'flame': Flame, 'crown': Crown, 'flag': Flag, 'gavel': Gavel, 'building': Building, 'users': Users, 'swords': Swords, 'scroll': Scroll, };

export default function VietnamHistoryApp() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginScreenProp>();
  const { hearts, error } = useAppSelector((state: any) => state.auth);

  const { selectedCharacterId, dynasties, currentLesson, loading } = useAppSelector((state) => state.timeline);

  useEffect(() => {
    dispatch(fetchTimeline());
  }, [dispatch]);

  useEffect(() => {
    dispatch(heartUsers());
    console.log("dddddddddddd", hearts);
  }, [dispatch])

  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', `Không thể tải dữ liệu: ${error}`, [
        { text: 'Thử lại', onPress: () => dispatch(fetchTimeline()) },
        { text: 'OK' }
      ]);
    }
  }, [error]);


  const handleShowCharacterDetail = async () => {
    if (!selectedCharacterId) {
      Alert.alert("Thông báo", "Chưa chọn nhân vật nào.");
      return;
    }
    try {
      // Gọi API fetch detail
      const detail = await dispatch(fetchDynastyDetail(selectedCharacterId)).unwrap();
      console.log("✅ Character detail:", detail);

      Alert.alert(
        `📜 ${detail.data.name}`,
        `
      🏰 Thời đại: ${detail.data.era}
      👑 Triều đại: ${detail.data.dynasty}
      📅 Năm sinh - mất: ${detail.data.birth_year} - ${detail.data.death_year}

      📝 Mô tả:
      ${detail.data.description}

      💡 Danh ngôn:
      "${detail.data.famous_quote}"
  `
      );

    } catch (err) {
      console.error("❌ Lỗi fetch detail:", err);
      Alert.alert("Lỗi", "Không thể tải thông tin nhân vật");
    }
  };

  interface TimelineItem {
    id?: string;
    parentId?: string;
    name?: string;
    period?: string;
    icon?: keyof typeof iconMap;
    completed?: boolean;
    color?: string;
    isMainDynasty?: boolean;
    isSubEvent?: boolean;
    description?: string;
    subEvents?: TimelineItem[];
  }

  const getAllItems = () => {
    if (!Array.isArray(dynasties)) return [];

    const allItems: TimelineItem[] = [];
    dynasties.forEach((dynasty) => {
      const dynastyYear = dynasty.start_year ?? 0;
      allItems.push({ ...dynasty, year: dynastyYear });

      if (dynasty.subEvents && Array.isArray(dynasty.subEvents)) {
        dynasty.subEvents.forEach((subEvent: any) => {
          allItems.push({ ...subEvent, parentId: dynasty.id, isSubEvent: true, year: subEvent.start_year ?? dynastyYear });
        });
      }

      if (dynasty.characters && Array.isArray(dynasty.characters)) {
        dynasty.characters.forEach((char: any) => {
          allItems.push({ ...char, parentId: dynasty.id, isCharacter: true, year: char.birth_year });
        });
      }
    });

    // Sort theo năm tăng dần
    allItems.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

    return allItems;
  };

  const allItems: TimelineItem[] = getAllItems();

  // Loading state
  if (loading && dynasties.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải lịch sử Việt Nam...</Text>
      </View>
    );
  }

  // Error state with retry
  if (error && dynasties.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Không thể tải dữ liệu</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchTimeline())}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (!loading && allItems.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Chưa có dữ liệu lịch sử</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchTimeline())}
        >
          <Text style={styles.retryButtonText}>Tải lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tính toán vị trí zigzag cho timeline
  const getZigzagPosition = (index: number) => {
    const item = allItems[index];
    if (item?.isMainDynasty) return width / 2 - 70;
    const padding = 40;
    const itemWidth = 220;
    return index % 2 === 0 ? padding : width - itemWidth - padding;
  }

  interface DynastyButtonProps {
    item: any;          // hoặc bạn định kiểu chính xác cho item
    index: number;
    isActive: boolean;
  }

  const DynastyButton: React.FC<DynastyButtonProps> = ({ item, index, isActive }) => {
    if (!item) return null;

    // Màu button: nếu completed thì dùng màu của item, nếu chưa thì gray
    const buttonColor = item.color || '#D1D5DB';


    const isCompleted = item.completed || false;

    const iconColor = isCompleted ? '#FFFFFF' : '#ffffffff';
    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Castle;
    const leftPosition = getZigzagPosition(index);
    const isMainDynasty = item.isMainDynasty || false;
    const buttonSize = 60;
    const iconSize = 20;
    // Nếu là main dynasty, thay bằng text header thay vì button icon
    if (isMainDynasty) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
          <View style={{ flex: 0.3, height: 1, borderBottomWidth: 1, borderColor: '#888', borderStyle: 'solid', marginRight: 5 }} />
          <Text style={{ marginHorizontal: 10, fontWeight: 'bold', color: '#444' }}>
            {item.name || 'Thời kỳ'}
          </Text>
          <View style={{ flex: 0.3, height: 1, borderBottomWidth: 1, borderColor: '#888', borderStyle: 'solid', marginLeft: 5 }} />
        </View>
      );
    }

    return (
      <View style={[styles.dynastyContainer, { alignItems: 'flex-start', marginVertical: 30 }]}>

        <View style={[styles.buttonAndInfoContainer, { left: leftPosition }]}>
          <TouchableOpacity
            onPress={() => {
              dispatch(setCurrentLesson(index))
              if (item.isCharacter) {
                // Nếu item là character thì lấy thẳng id
                console.log("✅ Character ID:", item.id);
                dispatch(setSelectedCharacterId(item.id));
              } else if (item.characters && item.characters.length > 0) {
                // Nếu là dynasty nhưng có characters thì lấy id của nhân vật đầu tiên
                console.log("✅ Dynasty có character, lấy ID:", item.characters[0].id);
                dispatch(setSelectedCharacterId(item.characters[0].id));
              } else {
                // Không có quiz
                Alert.alert('Thông báo', 'Sự kiện này chưa có Quiz.');
              }
            }}
            style={[
              styles.dynastyButton,
              {
                backgroundColor: buttonColor,
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
              },
              isActive && styles.activeButton,
              isMainDynasty && styles.mainDynastyButton,
            ]}
          >
            <IconComponent size={iconSize} color={iconColor} strokeWidth={2} />

            {isCompleted && (
              <View style={[
                styles.completedBadge,
                isMainDynasty ? styles.mainCompletedBadge : styles.subCompletedBadge
              ]}>
                <Star
                  size={isMainDynasty ? 18 : 14}
                  color="#FFFFFF"
                  fill="#FFFFFF"
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={[styles.dynastyInfo, { width: isMainDynasty ? 140 : 100 }]}>
            <Text
              style={[
                isMainDynasty ? styles.mainDynastyName : styles.subEventName,
                { textAlign: 'center' }
              ]}
              numberOfLines={2}
            >
              {item.name || 'Chưa có tên'}
            </Text>
            <Text
              style={[
                isMainDynasty ? styles.mainDynastyPeriod : styles.subEventPeriod,
                { textAlign: 'center' }
              ]}
            >
              {item.period || 'Chưa xác định'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const currentItem = allItems[currentLesson] || {};


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentItem.color || '#10B981' }]}>
        <View style={styles.headerStats}>
          <View style={styles.leftStats}>
            <View style={styles.flag} />
          </View>
          <View style={styles.rightStats}>
            <View style={styles.statItem}>
              <Flame size={17} color="#ff0000ff" fill="#f6660dff" />
              {loading && <Text style={styles.statLabel}>Loading...</Text>}
              {error && <Text>{error}</Text>}
              {hearts && <Text style={styles.statText}>{hearts.data?.hearts}</Text>}
            </View>
            <View style={styles.statItem}>
              <Shield size={17} color="#FFFFFF" />
              <Text style={styles.statText}>630</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Current Lesson Card */}
      <TouchableOpacity style={[styles.lessonCard, { backgroundColor: currentItem.color || '#207d5eff' }]} onPress={handleShowCharacterDetail}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonContent}>
            <Text style={styles.lessonCategory}>
              {currentItem.isMainDynasty ? 'GIAI ĐOẠN LỊCH SỬ' : 'SỰ KIỆN'}
            </Text>
            <Text style={styles.lessonTitle}>
              {currentItem.name || "Lịch sử Việt Nam"}
            </Text>
            <Text style={styles.lessonDescription}>
              {currentItem.description || "Tìm hiểu lịch sử dân tộc Việt Nam"}
            </Text>
          </View>
          <Book size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={async () => {
        console.log("selectedCharacterId", selectedCharacterId);
        if (!selectedCharacterId) {
          Alert.alert('Thông báo', 'Vui lòng chọn một sự kiện để bắt đầu Quiz');
          return;
        }
        try {
          // Fetch hearts mới trước khi kiểm tra
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

          // Nếu còn tim, vào Quiz
          navigation.navigate('Quiz', { characterId: selectedCharacterId });

        } catch (err) {
          console.log('Lỗi fetch hearts:', err);
          Alert.alert('Lỗi', 'Không thể kiểm tra tim hiện tại');
        }
      }}>
        <Text style={styles.startButtonText}>BẮT ĐẦU</Text>
      </TouchableOpacity>

      {/* Timeline */}
      <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineContainer}>
          {allItems.map((item, index) => (
            <DynastyButton
              key={`${item.id || item.parentId || 'item'}-${index}`}
              item={item}
              index={index}
              isActive={currentLesson === index}
            />
          ))}
        </View>
        <View style={styles.timelineEnd} />
      </ScrollView>

      {/* Loading overlay for refresh */}
      {loading && dynasties.length > 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#3B82F6" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorDetail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  leftStats: {
    flexDirection: 'row',
  },
  flag: {
    width: 32,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
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
  timeline: {
    flex: 1,
    paddingHorizontal: 0,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    position: 'relative',
  },
  dynastyContainer: {
    height: 100,
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  pathContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 30,
  },
  connectingLine: {
    position: 'absolute',
    top: 15,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  buttonAndInfoContainer: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
  },
  dynastyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    position: 'relative',
    zIndex: 2,
  },
  mainDynastyButton: {
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  activeButton: {
    transform: [{ scale: 1.1 }],
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  completedBadge: {
    position: 'absolute',
    borderRadius: 12,
    backgroundColor: '#23c65eff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  mainCompletedBadge: {
    width: 28,
    height: 28,
    top: -6,
    right: -6,
  },
  subCompletedBadge: {
    width: 22,
    height: 22,
    top: -4,
    right: -4,
  },
  dynastyInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  mainDynastyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 18,
  },
  subEventName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 14,
  },
  mainDynastyPeriod: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  subEventPeriod: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  timelineEnd: {
    height: 40,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  guestInfo: {
    backgroundColor: 'rgba(255, 165, 2, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFA502',
  },
  guestInfoText: {
    color: '#FFA502',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  eraHeader: {
    fontSize: 18,          // cỡ chữ lớn hơn bình thường
    fontWeight: 'bold',    // in đậm
    color: '#1F2937',      // màu chữ tối, có thể đổi tùy theme
    marginVertical: 10,    // khoảng cách trên/dưới
    textAlign: 'center',   // căn giữa
    letterSpacing: 2,      // khoảng cách giữa các chữ
    textTransform: 'uppercase'
  }
});