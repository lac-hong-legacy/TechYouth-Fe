import { getStoredGuestSession } from '@/modules/guest/utils/deviceUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useEffect, useState } from 'react';


type AuthContextType = {
    isLoggedIn: boolean;
    isGuestMode: boolean;
    canAccessApp: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    setGuestMode: (isGuest: boolean) => void;
    token: string | null;
};

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    isGuestMode: false,
    canAccessApp: false,
    login: async () => { },
    logout: async () => { },
    setGuestMode: () => { },
    token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // User can access app if they're logged in OR in guest mode
    const canAccessApp = isLoggedIn || isGuestMode;

    useEffect(() => {
        // Kiểm tra AsyncStorage khi app mở
        const loadAuthState = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            const guestSession = await getStoredGuestSession();
            
            if (storedToken) {
                setToken(storedToken);
                setIsLoggedIn(true);
            } else if (guestSession) {
                setIsGuestMode(true);
            }
        };
        loadAuthState();
    }, []);

    const login = async (userToken: string) => {
        await AsyncStorage.setItem('userToken', userToken);
        setToken(userToken);
        setIsLoggedIn(true);
        setIsGuestMode(false); // Clear guest mode when user logs in
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        setToken(null);
        setIsLoggedIn(false);
        // Don't automatically set guest mode on logout
    };

    const setGuestModeHandler = (isGuest: boolean) => {
        setIsGuestMode(isGuest);
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            isGuestMode, 
            canAccessApp, 
            login, 
            logout, 
            setGuestMode: setGuestModeHandler, 
            token 
        }}>
            {children}
        </AuthContext.Provider>
    );
};