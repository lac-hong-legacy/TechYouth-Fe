import TabsScreen from '@/app/(tabs)/_layout';
import QuizScreen from '@/app/(tabs)/quiz';
import { AuthContext } from '@/rootNavigator/AuthContext';
import AuthNavigator from '@/rootNavigator/AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

const AppStack = createNativeStackNavigator();


function AppNavigator() {
    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Tabs" component={TabsScreen} />
            <AppStack.Screen name="Quiz" component={QuizScreen} />
        </AppStack.Navigator>
    );
}
export default function RootNavigator() {
    const { isLoggedIn } = useContext(AuthContext)

    return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}