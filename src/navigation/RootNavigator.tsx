import TabsScreen from '@/src/components/(tabs)/_layout';
import QuizScreen from '@/src/components/quiz/quiz';
import { AuthContext } from '@/src/navigation/AuthContext';
import AuthNavigator from '@/src/navigation/AuthNavigator';
import CharacterDetailScreen from '@/src/screens/Home/components/CharacterDetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

const AppStack = createNativeStackNavigator();


function AppNavigator() {
    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Tabs" component={TabsScreen} />
            <AppStack.Screen name="Quiz" component={QuizScreen} />
            <AppStack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
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