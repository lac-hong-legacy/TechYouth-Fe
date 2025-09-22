import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";


type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Tabs: undefined;
    NotFound: undefined;
};

const questions = [
    {
        q: "Được sự ủng hộ của nhân dân, Nguyễn Huệ đã tổ chức trận đánh nào đánh tan tành quân xâm lược?",
        a: "Trận Rạch Gầm - Xoài Mút",
        options: ["Trận Rạch Gầm - Xoài Mút", "Trận Bạch Đằng", "Trận Đánh Ung Châu", "Trân Đánh Quân Mông Nguyên"],
    },
    {
        q: "Chiến thắng Bạch Đằng năm?",
        a: "938",
        options: ["938", "1288", "1427", "1789"],
    },
    {
        q: "Thành Cổ Loa ở đâu?",
        a: "Đông Anh",
        options: ["Đông Anh", "Thanh Hóa", "Huế", "Hà Nội"],
    },
    {
        q: "Lý Thái Tổ dời đô về?",
        a: "Thăng Long",
        options: ["Hoa Lư", "Thăng Long", "Huế", "Đông Kinh"],
    },
];

export default function QuizScreen() {
    const navigation = useNavigation<LoginScreenProp>();
    const [index, setIndex] = useState(0);
    const [hearts, setHearts] = useState(4);

    const handleAnswer = (answer: string) => {
        if (answer === questions[index].a) {
            if (index === questions.length - 1) {
                Alert.alert("Hết câu hỏi!", "Vui lòng đăng nhập để tiếp tục", [
                    { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
                ]);
            } else {
                setIndex(index + 1);
            }
        } else {
            setHearts(hearts - 1);
            if (hearts - 1 <= 0) {
                Alert.alert("Hết tim!", "Xem quảng cáo để hồi tim?");
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Hiển thị tim */}
            <View style={styles.heartContainer}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Text key={i} style={[styles.heart, { opacity: i < hearts ? 1 : 0.2 }]}>
                        ❤️
                    </Text>
                ))}
            </View>

            {/* Khung câu hỏi */}
            <View style={styles.questionBox}>
                <Text style={styles.question}>{questions[index].q}</Text>
            </View>

            {/* 4 đáp án */}
            <View style={styles.optionsContainer}>
                {questions[index].options.map((opt, i) => (
                    <Pressable
                        key={i}
                        style={styles.optionBtn}
                        onPress={() => handleAnswer(opt)}
                    >
                        <Text style={styles.optionText}>{opt}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        padding: 20,
        justifyContent: "flex-start",
    },
    heartContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 40,
    },
    heart: {
        fontSize: 20,
        marginHorizontal: 4,
    },
    questionBox: {
        backgroundColor: "#424040ff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
    },
    question: {
        fontSize: 20,
        color: "#fefefeff",
        textAlign: "center",
        fontWeight: "600",
    },
    optionsContainer: {
        marginTop: 10,
    },
    optionBtn: {
        backgroundColor: "#3a3a3a",
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
    },
    optionText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
});