// import { getStoredGuestSession } from '@/modules/guest/utils/deviceUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useEffect, useState } from 'react';


type AuthContextType = {
    isLoggedIn: boolean;
    isProfileCompleted: boolean;
    isGuestMode: boolean;
    canAccessApp: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    setGuestMode: (isGuest: boolean) => void;
    token: string | null;
    completeProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    isProfileCompleted: false,
    isGuestMode: false,
    canAccessApp: false,
    login: async () => { },
    logout: async () => { },
    setGuestMode: () => { },
    completeProfile: async () => { },
    token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // User can access app if they're logged in OR in guest mode
    const canAccessApp = isLoggedIn || isGuestMode;

    useEffect(() => {
        // Kiểm tra AsyncStorage khi app mở
        const loadAuthState = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            const profileCompleted = await AsyncStorage.getItem("profileCompleted");
            // const guestSession = await getStoredGuestSession();
            if (storedToken) {
                setToken(storedToken);
                setIsLoggedIn(true);
                setIsProfileCompleted(profileCompleted === "true");

            }
            // } else if (guestSession) {
            //     setIsGuestMode(true);
            // }
        };
        loadAuthState();
    }, []);

    const login = async (userToken: string, profileCompleted: boolean = false) => {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem("profileCompleted", profileCompleted.toString());
        setToken(userToken);
        setIsLoggedIn(true);
        setIsProfileCompleted(profileCompleted);
        setIsGuestMode(false)
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem("profileCompleted");
        setToken(null);
        setIsLoggedIn(false);

    };
    const setGuestModeHandler = (isGuest: boolean) => {
        setIsGuestMode(isGuest);
    };
    const completeProfile = async () => {
        await AsyncStorage.setItem("profileCompleted", "true");
        setIsProfileCompleted(true);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isGuestMode, canAccessApp, setGuestMode: setGuestModeHandler, isProfileCompleted, completeProfile, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};