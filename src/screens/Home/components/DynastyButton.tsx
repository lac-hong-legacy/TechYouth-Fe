import { 
  Castle, Star, Shield, Flame, Crown, Flag, 
  Gavel, Building, Users, Swords, Scroll 
} from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const iconMap = { 
  castle: Castle, 
  shield: Shield, 
  flame: Flame, 
  crown: Crown, 
  flag: Flag, 
  gavel: Gavel, 
  building: Building, 
  users: Users, 
  swords: Swords, 
  scroll: Scroll, 
};

interface DynastyButtonProps {
  item: any;
  index: number;
  isActive: boolean;
  onPress: () => void;
}

export const DynastyButton = ({ item, index, isActive, onPress }: DynastyButtonProps) => {
  if (!item) return null;

  const getZigzagPosition = (idx: number) => {
    if (item?.isMainDynasty) return width / 2 - 70;
    const padding = 40;
    const itemWidth = 220;
    return idx % 2 === 0 ? padding : width - itemWidth - padding;
  };

  const buttonColor = item.color || '#D1D5DB';
  const isCompleted = item.completed || false;
  const iconColor = isCompleted ? '#FFFFFF' : '#ffffffff';
  const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Castle;
  const leftPosition = getZigzagPosition(index);
  const isMainDynasty = item.isMainDynasty || false;
  const buttonSize = 60;
  const iconSize = 20;

  if (isMainDynasty) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
        <View style={{ flex: 0.3, height: 1, borderBottomWidth: 1, borderColor: '#888', marginRight: 5 }} />
        <Text style={{ marginHorizontal: 10, fontWeight: 'bold', color: '#444' }}>
          {item.name || 'Thời kỳ'}
        </Text>
        <View style={{ flex: 0.3, height: 1, borderBottomWidth: 1, borderColor: '#888', marginLeft: 5 }} />
      </View>
    );
  }

  return (
    <View style={[dynastyButtonStyles.dynastyContainer, { alignItems: 'flex-start', marginVertical: 30 }]}>
      <View style={[dynastyButtonStyles.buttonAndInfoContainer, { left: leftPosition }]}>
        <TouchableOpacity
          onPress={onPress}
          style={[
            dynastyButtonStyles.dynastyButton,
            {
              backgroundColor: buttonColor,
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
            isActive && dynastyButtonStyles.activeButton,
          ]}
        >
          <IconComponent size={iconSize} color={iconColor} strokeWidth={2} />

          {isCompleted && (
            <View style={[dynastyButtonStyles.completedBadge, dynastyButtonStyles.subCompletedBadge]}>
              <Star size={14} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <View style={[dynastyButtonStyles.dynastyInfo, { width: 100 }]}>
          <Text style={[dynastyButtonStyles.subEventName, { textAlign: 'center' }]} numberOfLines={2}>
            {item.name || 'Chưa có tên'}
          </Text>
          <Text style={[dynastyButtonStyles.subEventPeriod, { textAlign: 'center' }]}>
            {item.period || 'Chưa xác định'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const dynastyButtonStyles = StyleSheet.create({
  dynastyContainer: {
    height: 100,
    width: '100%',
    position: 'relative',
    marginBottom: 15,
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    position: 'relative',
    zIndex: 2,
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
  subEventName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 14,
  },
  subEventPeriod: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
});