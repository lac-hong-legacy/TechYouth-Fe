import TabsScreen from '@/app/(tabs)/_layout';
import QuizScreen from '@/app/quiz/quiz';
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
    const { isLoggedIn, isProfileCompleted } = useContext(AuthContext)

    if (!isLoggedIn) {
        return <AuthNavigator />;
    }

    // Nếu login rồi nhưng chưa nhập năm sinh → ở lại AuthNavigator (BirthYear)
    if (isLoggedIn && !isProfileCompleted) {
        return <AuthNavigator />; // BirthYear nằm trong AuthNavigator
    }

    // Nếu login và đã nhập profile → vào app chính
    return <AppNavigator />;
}