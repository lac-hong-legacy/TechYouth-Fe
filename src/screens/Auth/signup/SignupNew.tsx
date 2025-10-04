import AppButton from "@/components/appButton";
import BackButton from "@/components/BackButton";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { AuthContext } from '@/src/navigation/AuthContext';
import { registerUser } from "@/src/redux/thunks/authThunks";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


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

const SignupNew = () => {
    const navigation = useNavigation<LoginScreenProp>();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { isLoggedIn, login, logout } = useContext(AuthContext);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (field: string, value: string | number) => {
        let errorMsg = "";

        switch (field) {
            case "username":
                if (!String(value).trim()) errorMsg = "Vui lòng nhập tên tài khoản";
                break;
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

        if (field === 'username') setUsername(value);

        validateField(field, value); // validate ngay khi nhập
    }
    const handSign = () => {
        // validate tất cả các trường
        validateField("email", email)
        validateField("password", password)
        validateField("username", password)

        const hasErrors = Object.values(errors).some((msg) => msg);
        if (hasErrors) return;
        if (!email || !password || !username) {
            Alert.alert('Lỗi', 'vui lòng nhập đầy đủ thông tin')
            return;
        }
        if (email && password && username) {
            dispatch(registerUser({ email, password, username }))
                .unwrap()
                .then(async (res: any) => {
                    // Hiển thị thông báo thành công
                    Alert.alert("Thành công", "Bạn đã đăng kí thành công");

                    // Reset email/password
                    setEmail("");
                    setPassword("");
                    setUsername("");
                    navigation.navigate("Login")
                })
                .catch((err: any) => {
                    // Nếu server trả về { code: 500, message: "email already exists" }
                    Alert.alert("Lỗi", err.message || "Đăng ký thất bại, vui lòng thử lại");
                    console.log(err)
                });
        }

    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
                    <BackButton />
                    <View style={styles.backTextContainer}>
                        <Text style={styles.backText}>Điền thông tin</Text>
                    </View>

                </TouchableOpacity>
                <View style={styles.from}>
                    <KeyboardAvoidingView>
                        <TextInput style={[styles.input, errors.username && styles.inputError]} placeholder="Tên tài khoản" value={username} onChangeText={(text) => handlechange("username", text)} />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                        <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Email" value={email} onChangeText={(text) => handlechange("email", text)} />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                        <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="Mật khẩu" value={password} onChangeText={(text) => handlechange("password", text)} secureTextEntry />
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        <AppButton title="Đăng ký" type="gray" weight="400" onPress={handSign} style={styles.buttons} />
                    </KeyboardAvoidingView>
                </View>
                <View style={styles.contaibutton}>
                    <Text style={styles.text}>Khi đăng ky vào VEN, bạn đồng ý với chính sách tài khoản và quyền riêng tư của chúng tôi.</Text>
                </View>


            </View>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>
    );
}
export default SignupNew

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