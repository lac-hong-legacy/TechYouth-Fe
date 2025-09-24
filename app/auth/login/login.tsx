import AppButton from "@/components/appButton";
import BackButton from "@/components/BackButton";
import { LoginResponse } from "@/modules/auth/store/authSlice";
import { loginUser } from "@/modules/auth/store/authThunks";
import { useAppDispatch } from "@/modules/hooks/useAppDispatch";
import { AuthContext } from '@/rootNavigator/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Welcome: undefined;
    NotFound: undefined;
    Tabs: undefined;
    BirthYear: undefined

};

const LoginForm = () => {
    const navigation = useNavigation<LoginScreenProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { isLoggedIn, login, logout } = useContext(AuthContext);

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

        if (isLoggedIn) {
            Alert.alert("Thông báo", "Bạn đã đăng nhập rồi!");
            return;
        }

        if (email && password) {
            dispatch(loginUser({ email, password }))
                .unwrap()
                .then(async (res: LoginResponse) => {
                    await login(res.access_token);

                    // Hiển thị thông báo thành công
                    Alert.alert("Thành công", "Bạn đã đăng nhập thành công!");

                    // Reset email/password
                    setEmail("");
                    setPassword("");
                    navigation.navigate("BirthYear");
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

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
                <BackButton />
                <View style={styles.backTextContainer}>
                    <Text style={styles.backText}>Điền thông tin</Text>
                </View>

            </TouchableOpacity>
            <View style={styles.from}>
                <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Email" value={email} onChangeText={(text) => handlechange("email", text)} />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="Mật khẩu" value={password} onChangeText={(text) => handlechange("password", text)} secureTextEntry />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <AppButton title="Đăng Nhập" type="gray" weight="400" onPress={handLogin} style={styles.buttons} />
                <Text style={styles.QMK} onPress={() => navigation.navigate("ForgotPassword")}>Quên Mật Khẩu</Text>
            </View>

            <View style={styles.contaibutton}>
                <AppButton title="Đăng nhập bằng Google" type="secondary" onPress={handleLogout} style={styles.button} />
                <AppButton title="Đăng nhập bằng Google" type="secondary" onPress={handgooogle} style={styles.button} />
                <AppButton title="Đăng nhập bằng Facebook" type="secondary" onPress={handgooogle} style={styles.button} />
                <AppButton title="Đăng nhập bằng Apple" type="secondary" onPress={handgooogle} style={styles.button} />


                <Text style={styles.text}>Khi đăng nhập vào VEN, bạn đồng ý với chính sách tài khoản và quyền riêng tư của chúng tôi.</Text>
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
        backgroundColor: '#ffffffff',
        paddingHorizontal: 10,
    },
    backButton: {
        flexDirection: "row",   // icon + text nằm ngang
        alignItems: "center",   // căn giữa theo chiều dọc
        padding: 10,
        marginBottom: 24,
    },
    backTextContainer: {
        flex: 1,
        alignItems: "center",   // căn giữa theo chiều ngang
        justifyContent: "center",
    },
    backText: {
        fontSize: 16,
        fontWeight: "600",
        fontStyle: 'normal',
    },
    from: {
        backgroundColor: '#ffffffff',
        padding: 10,
        borderColor: 'gray',
        borderRadius: 10,
        marginBottom: 40,
    },
    input: {
        borderWidth: 1, // viền trong
        borderColor: 'gray', // viền ngoài
        padding: 10, // bên trong
        marginVertical: 5, // cách đều trên dưới
        borderRadius: 20, // bo góc
    },
    buttons: {
        fontSize: 12,
        marginTop: 24,
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
        color: 'back',
        marginTop: 16,
        fontSize: 12
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
    contaibutton: {

        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginBottom: 16
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400'
    }
})