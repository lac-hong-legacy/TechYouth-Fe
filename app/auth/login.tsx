import { useAppDispatch } from "@/modules/hooks/useAppDispatch";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { loginUser } from "@/modules/auth/store/authThunks";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";


type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Tabs: undefined;
    NotFound: undefined;
};

const LoginForm = () => {
    const navigation = useNavigation<LoginScreenProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const validateField = (field: string, value: string | number) => {
        let errorMsg = "";

        switch (field) {
            case "email":
                if (!String(value).trim()) errorMsg = "Vui lòng nhập tài khoản";
                break;
            case "password":
                if (!String(value)) errorMsg = "Vui lòng nhập mật khẩu";
                break;
        }
        setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
    const handlechange = (field: string, value: string) => {
        if (field === 'email') setEmail(value);

        if (field === 'password') setPassword(value);

        validateField(field, value); // validate ngay khi nhập
    }
    const handLogin = () => {
        // validate tất cả các trường
        validateField("email", email)
        validateField("password", password)

        const hasErrors = Object.values(errors).some((msg) => msg);
        if (hasErrors) return;

        if (email && password) {
            dispatch(loginUser({ email, password }))
                .unwrap()
                .then((res) => {
                    Alert.alert("Thành công", "Bạn đã đăng nhập thành công!");
                    setEmail("");
                    setPassword("");
                    navigation.navigate("Tabs");
                })

            if (!email || !password) {
                Alert.alert('Lỗi', 'vui lòng nhập đầy đủ thông tin')
                return;
            }
        }

    }
    const handgooogle = () => {
        Alert.alert('Thông báo', 'Đăng nhập bằng Google chưa được hỗ trợ');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Tabs")}>
                <Ionicons name="arrow-back" size={24} color="#8B0000" />
                <Text style={styles.backText}>Trang chủ</Text>
            </TouchableOpacity>
            <View style={styles.from}>
                <Text style={styles.title}>Đăng nhập</Text>

                <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Email" value={email} onChangeText={(text) => handlechange("email", text)} />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="Mật khẩu" value={password} onChangeText={(text) => handlechange("password", text)} secureTextEntry />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <Button mode="contained" textColor="white" buttonColor="#8B0000" style={{ marginBottom: 10 }} onPress={handLogin}>Đăng nhập</Button>
                <Text style={styles.QMK} onPress={() => navigation.navigate("ForgotPassword")}>Quên Mật Khẩu</Text>
                <Text style={styles.division}>-------------------------------------------------</Text>
                <Button mode="contained" textColor="white" buttonColor="#8B0000" style={{ marginBottom: 10 }} onPress={handgooogle}>Google</Button>
                <Button mode="contained" textColor="white" buttonColor="#8B0000" onPress={handgooogle}>Facebook</Button>
                <Text style={styles.register} onPress={() => navigation.navigate("Signup")}>Chưa có tài khoản? Đăng ký ngay</Text>
            </View>
        </View>
    );
}
export default LoginForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#F5DEB3',
        paddingHorizontal: 10,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backText: {
        marginLeft: 5,
        color: "#8B0000",
        fontSize: 16,
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        borderColor: 'red',
        textAlign: 'center', // canh giữa
    },
    from: {
        marginVertical: 20, // cách đều trên dưới
        backgroundColor: '#FFF8DC',
        padding: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,

    },
    input: {
        borderWidth: 1, // viền trong
        borderColor: 'gray', // viền ngoài
        padding: 10, // bên trong
        marginVertical: 10, // cách đều trên dưới
        borderRadius: 10, // bo góc
    },
    register: {
        color: 'blue',
        textAlign: 'center', // canh giữa
        marginTop: 20,
        textDecorationLine: 'underline', // gạch chân
    },
    division: {
        textAlign: 'center',
        marginVertical: 5,
        color: 'gray',
    },
    QMK: {
        textAlign: 'center',
        color: 'blue',
        marginBottom: 10,
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