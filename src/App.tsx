import { store } from '@/src/redux/store';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/src/navigation/AuthContext';
import RootNavigator from '@/src/navigation/RootNavigator';


export default function RootApp() {
    const colorScheme = useColorScheme();

    return (
        <Provider store={store}>
            <PaperProvider>
                <AuthProvider>
                    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <RootNavigator />
                        <StatusBar style="auto" />
                    </NavigationContainer>
                </AuthProvider>
            </PaperProvider>
        </Provider>
    );
}
