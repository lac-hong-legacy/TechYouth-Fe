import EventsScreen from '@/app/(tabs)/event';
import HomeScreen from "@/app/(tabs)/index";
import profilrScreen from '@/app/(tabs)/profile';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      {/* <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          title: 'Bài học',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="book.fill" color={color} />,
        }}
      /> */}
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
