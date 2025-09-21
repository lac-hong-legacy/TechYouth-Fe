import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsScreen from '@/app/(tabs)/_layout';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabsScreen} />
        </Stack.Navigator>
    );
}