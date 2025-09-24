import AppButton from "@/components/appButton";
import { useGuest } from "@/modules/guest";
import { AuthContext } from "@/rootNavigator/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";


type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Tabs: undefined;
    NotFound: undefined;
    Welcome: undefined;
    Textlogin: undefined;
};

type SignupScreenProp = NativeStackNavigationProp<RootStackParamList, "Welcome">

export default function WelcomeScreen() {
    const navigation = useNavigation<SignupScreenProp>();
    const { initializeGuestSession } = useGuest();
    const { setGuestMode } = useContext(AuthContext);

    const handleGuestMode = async () => {
        try {
            await initializeGuestSession();
            // Set guest mode in AuthContext - this will automatically navigate to AppNavigator
            setGuestMode(true);
        } catch (error) {
            console.error("Failed to initialize guest session:", error);
            // Fallback to signup if guest mode fails
            navigation.navigate("Signup");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("@/assets/images/icon-cao-removebg-preview.png")} />
            <Text style={styles.title}>VEN</Text>

            <AppButton title="Khám phá ngay" onPress={handleGuestMode} style={styles.buton} />
            <AppButton title="Đã có Tài Khoản" type="secondary" onPress={() => navigation.navigate("Textlogin")} style={styles.buton} />
            <AppButton title="Đăng ký ngay" type="secondary" onPress={() => navigation.navigate("Signup")} style={styles.buton} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
        padding: 20,
    },
    logo: {
        width: 250,
        height: 250,
    },
    title: {
        fontSize: 64,
        marginBottom: 32,
        marginTop: 32,
        color: "#C49B2E",
        fontWeight: "bold",
    },
    buton: {
        marginBottom: 16
    }
})