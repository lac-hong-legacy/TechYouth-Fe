import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/modules/hooks/useAppDispatch";
import { registerUser } from "@/modules/auth/store/authThunks";
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Tabs: undefined;
    NotFound: undefined;
};

type SignupScreenProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupForm = () => {
    const navigation = useNavigation<SignupScreenProp>();
    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.auth);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (field: string, value: string | number) => {
        let errorMsg = "";

        switch (field) {
            case "email":
                if (!String(value).trim()) errorMsg = "Vui lòng nhập email";
                else if (!/\S+@\S+\.\S+/.test(String(value))) errorMsg = "Email không hợp lệ";
                break;
            case "password":
                if (!String(value)) errorMsg = "Vui lòng nhập mật khẩu";
                else if (String(value).length < 6) errorMsg = "Mật khẩu phải có ít nhất 6 ký tự";
                break;
            case "confirmPassword":
                if (!String(value)) errorMsg = "Vui lòng nhập lại mật khẩu";
                else if (String(value) !== password) errorMsg = "Mật khẩu không khớp";
                break;
        }
        setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }

    const handleSignup = () => {
        // validate tất cả các trường 
        validateField('email', email);
        validateField('password', password);
        validateField('confirmPassword', confirmPassword);


        const hasErrors = Object.values(errors).some((msg) => msg);
        if (hasErrors) return;

        if (email && password && password === confirmPassword) {
            dispatch(registerUser({ email, password }))
                .unwrap()
                .then((res) => {
                    Alert.alert("Thành công", "Bạn đã đăng ký thành công!");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    navigation.navigate("Login");
                })
                .catch((err) => {
                    console.log("❌ Đăng ký thất bại:", err);
                    if (err?.response?.data?.ui?.messages) {
                        const messages = err.response.data.ui.messages.map((m: any) => m.text).join("\n");

                        if (messages.includes("already exists") || messages.includes("already registered")) {
                            Alert.alert("Thông báo", "Tài khoản hoặc email đã tồn tại!");
                        } else {
                            Alert.alert("Lỗi", messages);
                        }

                    } else {
                        Alert.alert("Lỗi", "Đăng ký thất bại, vui lòng thử lại.");
                    }
                });
        }
    }

    const handlechange = (field: string, value: string) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        if (field === 'confirmPassword') setConfirmPassword(value);

        validateField(field, value); // validate ngay khi nhập
        if (field === 'password' && confirmPassword) {
            validateField('confirmPassword', confirmPassword); // validate lại confirm khi password đổi
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Đăng ký</Text>
                <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Email" value={email} onChangeText={(text) => handlechange("email", text)} keyboardType="email-address" />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="Mật khẩu" value={password} onChangeText={(Text) => handlechange("password", Text)} secureTextEntry />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <TextInput style={[styles.input, errors.confirmPassword && styles.inputError]} placeholder="Nhập lại mật khẩu" value={confirmPassword} onChangeText={(Text) => handlechange("confirmPassword", Text)} secureTextEntry />
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                <Button mode="contained" textColor="white" buttonColor="#8B0000" onPress={handleSignup}>Đăng ký</Button>

                <Text style={styles.link} onPress={() => navigation.navigate("Login")}>Đã có tài khoản? Đăng nhập</Text>
            </View>
        </View>
    )
}

export default SignupForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#F5DEB3',
        paddingHorizontal: 10,
    },
    card: {
        marginVertical: 20, // cách đều trên dưới
        backgroundColor: '#FFF8DC',
        padding: 20,
        borderWidth: 1,
        borderColor: 'gray', // viền ngoài màu xám
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold', // in đậm
        textAlign: 'center',
    },
    input: {
        borderWidth: 1, // viền trong
        borderColor: 'gray', // viền ngoài
        padding: 10, // bên trong
        marginVertical: 10, // cách đều trên dưới
        borderRadius: 10, // bo góc
    },
    link: {
        color: 'blue',
        marginTop: 15, // cách trên
        textAlign: 'center', // canh giữa
    },
    errorText: {
        color: 'red',
        marginBottom: 4,
        marginLeft: 5,
        fontSize: 12,
    },
    inputError: {
        borderColor: 'red',
    },
})