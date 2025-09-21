import { store } from '@/modules/store/store';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import RootNavigator from '@/rootNavigator/RootNavigator';

const Stack = createNativeStackNavigator();
export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <Provider store={store}>
            <PaperProvider>
                <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <RootNavigator />
                    <StatusBar style="auto" />
                </NavigationContainer>
            </PaperProvider>
        </Provider>
    );
}
