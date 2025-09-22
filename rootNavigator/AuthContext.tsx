import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useEffect, useState } from 'react';


type AuthContextType = {
    isLoggedIn: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    token: string | null;
};

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: async () => { },
    logout: async () => { },
    token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Kiểm tra AsyncStorage khi app mở
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            if (storedToken) {
                setToken(storedToken);
                setIsLoggedIn(true);
            }
        };
        loadToken();
    }, []);

    const login = async (userToken: string) => {
        await AsyncStorage.setItem('userToken', userToken);
        setToken(userToken);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        setToken(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};