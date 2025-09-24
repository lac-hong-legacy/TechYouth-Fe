import AppButton from "@/components/appButton";
import { initProfile } from "@/modules/auth/store/authThunks";
import { useAppDispatch, useAppSelector } from "@/modules/hooks/useAppDispatch";
import { AuthContext } from "@/rootNavigator/AuthContext";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'BirthYear'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Welcome: undefined;
    NotFound: undefined;
    Tabs: undefined;
    BirthYear: undefined

};

export default function Birthyear() {
    const [birthYear, setBirthYear] = useState<number | null>(null);
    const navigation = useNavigation<LoginScreenProp>();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: any) => state.auth);
    const { login, token } = useContext(AuthContext);
    const { isLoggedIn, logout, completeProfile } = useContext(AuthContext);

    const handleSubmit = async () => {
        if (!birthYear) return;
        try {
            const resultAction = await dispatch(initProfile({ birthYear }));
            if (initProfile.fulfilled.match(resultAction)) {
                Alert.alert("Thành công", "Cập nhật năm sinh thành công!");
                await completeProfile();
            } else {
                Alert.alert("Thất bại", "Không thể cập nhật năm sinh!");
            }
        } catch (err) {
            console.log("Init profile error:", err);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nhập năm sinh của bạn</Text>

            <TextInput
                style={styles.input}
                placeholder="Ví dụ: 2002"
                keyboardType="numeric"
                value={birthYear !== null ? birthYear.toString() : ""}   // luôn truyền string
                onChangeText={(text) => {
                    const numericValue = parseInt(text, 10);
                    if (!isNaN(numericValue)) {
                        setBirthYear(numericValue);   // lưu số
                    } else {
                        setBirthYear(null);           // khi user xóa input
                    }
                }}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <AppButton title="logout" onPress={handleLogout} />

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Đang lưu..." : "Xác nhận"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
})