import EventsScreen from '@/app/(tabs)/event';
import HomeScreen from "@/app/(tabs)/index";
import profilrScreen from '@/app/(tabs)/profile';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        // headerShown: false,
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarActiveTintColor: '#207d5e', // xanh ngọc hợp với màu chủ đạo
        tabBarInactiveTintColor: '#8c7a5b', // nâu nhạt để hòa với màu nền
        tabBarStyle: {
          backgroundColor: '#f4ecd8',  // đồng bộ với nền chính
          borderTopWidth: 1,
          borderTopColor: '#d6c7a1',   // viền mảnh nhẹ nhàng
          elevation: 5,                // đổ bóng cho nổi lên
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          title: 'Thời kỳ',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="book.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={profilrScreen}
        options={{
          title: 'Thông tin',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="person.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
