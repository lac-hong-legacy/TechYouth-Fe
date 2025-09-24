import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useEffect, useState } from 'react';


type AuthContextType = {
    isLoggedIn: boolean;
    isProfileCompleted: boolean;
    login: (token: string, profileCompleted?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    token: string | null;
    completeProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    isProfileCompleted: false,
    login: async () => { },
    logout: async () => { },
    completeProfile: async () => { },
    token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Kiểm tra AsyncStorage khi app mở
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            const profileCompleted = await AsyncStorage.getItem("profileCompleted");
            if (storedToken) {
                setToken(storedToken);
                setIsLoggedIn(true);
                setIsProfileCompleted(profileCompleted === "true");
            }
        };
        loadToken();
    }, []);

    const login = async (userToken: string, profileCompleted: boolean = false) => {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem("profileCompleted", profileCompleted.toString());
        setToken(userToken);
        setIsLoggedIn(true);
        setIsProfileCompleted(profileCompleted);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem("profileCompleted");
        setToken(null);
        setIsLoggedIn(false);
        setIsProfileCompleted(false);
    };

    const completeProfile = async () => {
        await AsyncStorage.setItem("profileCompleted", "true");
        setIsProfileCompleted(true);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isProfileCompleted, completeProfile, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};