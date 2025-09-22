import AppButton from "@/components/appButton";
import BackButton from '@/components/BackButton';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Tabs: undefined;
    NotFound: undefined;
    Welcome: undefined;
    Textlogin: undefined;
};

type SignupScreenProp = NativeStackNavigationProp<RootStackParamList, "Textlogin">

export default function TextLogin() {
    const navigation = useNavigation<SignupScreenProp>();
    return (
        <View style={styles.container}>
            <View style={styles.backContainer}>
                <BackButton to="Welcome" />
            </View>
            <View style={styles.group}>
                <Text style={styles.title}>Bạn đã có tài khoản?</Text>
                <Text style={styles.titles}>Tiếp tục hành trình khám phá Sử Việt của bạn</Text>
                <AppButton title="Đăng nhập" onPress={() => navigation.navigate("Login")} />
            </View>
            <Text style={styles.cs}>----------------------------------------------------------------------------------</Text>
            <View style={styles.group}>
                <Text style={styles.title}>Bạn là người mới?</Text>
                <Text style={styles.titles}>Bắt đầu khám phá ngay</Text>
                <AppButton title="Đăng ký" type="secondary" onPress={() => navigation.navigate("Login")} />
            </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#ffffffff'
    },
    backContainer: {
        position: "absolute",
        top: 80,
        left: 20,
    },
    group: {
        alignItems: "center",
        marginBottom: 40,

    },
    title: {
        fontSize: 20,
        marginBottom: 16
    },
    titles: {
        fontSize: 16,
        marginBottom: 32
    },
    cs: {
        marginBottom: 40,
        marginTop: 40,
        color: "#999",
    }
})