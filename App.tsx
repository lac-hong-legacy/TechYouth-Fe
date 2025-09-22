import { store } from '@/modules/store/store';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/rootNavigator/AuthContext';
import RootNavigator from '@/rootNavigator/RootNavigator';


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
