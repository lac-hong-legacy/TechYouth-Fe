import { fetchCharacterQuiz, heartUsers, loses, validateLessonAnswer } from "@/modules/auth/store/authThunks";
import { useAppDispatch, useAppSelector } from '@/modules/hooks/useAppDispatch';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Flame, Shield } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { Alert, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Tabs: undefined;
    NotFound: undefined;
    Quiz: { characterId: string }
};
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function QuizScreen() {
    const navigation = useNavigation<LoginScreenProp>();
    const route = useRoute<QuizScreenRouteProp>();
    const dispatch = useAppDispatch();
    const { characterId } = route.params;
    const { quizData, quizLoading } = useAppSelector((state) => state.dynasty);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [fillBlankAnswer, setFillBlankAnswer] = useState("");
    const { hearts, loading, error } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        if (characterId) {
            dispatch(fetchCharacterQuiz(characterId));
            console.log("✅ characterId received in QuizScreen:", characterId)
        }
    }, [characterId]);

    useEffect(() => {
        dispatch(heartUsers());
    }, [dispatch])
    //Thêm state để lưu đáp án người dùng:
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const lesson = Array.isArray(quizData) && quizData.length > 0 ? quizData[0] : null;
    const questions = lesson?.questions || [];
    const question = questions[currentQuestionIdx] || null;
    const [orderAnswer, setOrderAnswer] = useState<string[]>([]);

    const [validating, setValidating] = useState(false);
    const [quizResult, setQuizResult] = useState<any>(null);


    const handleAnswer = async (option?: string, orderingAnswer?: string[]) => {
        if (!lesson || !question || validating) return;
        setValidating(true);

        let answerValue = "";
        if (question.type === "multiple_choice") answerValue = option || "";
        if (question.type === "fill_blank") answerValue = fillBlankAnswer;
        if (question.type === "ordering") answerValue = JSON.stringify(orderingAnswer || []);

        try {
            const res = await dispatch(validateLessonAnswer({
                lesson_id: lesson.id,
                question_id: question.id,
                answer: answerValue
            })).unwrap();

            console.log("✅ Full validate response:", res);
            setQuizResult(res);

            if (res.correct || res.passed) {
                setFillBlankAnswer("");
                setSelectedOption(null);
                setOrderAnswer([]);
                if (res.passed) {
                    // Bỏ qua các câu còn lại
                    setShowResult(true);
                } else if (currentQuestionIdx < questions.length - 1) {
                    setCurrentQuestionIdx(currentQuestionIdx + 1);
                } else {
                    setShowResult(true);
                }
            } else {
                alert("Sai rồi, thử lại nhé!");
                try {
                    await dispatch(loses()).unwrap(); // trừ tim
                    const updatedHearts = await dispatch(heartUsers()).unwrap(); // fetch lại hearts mới
                    if (updatedHearts.data?.hearts === 0) {
                        Alert.alert(
                            "Hết tim",
                            "Bạn đã hết tim rồi! Quay về trang chính.",
                            [
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate("Tabs") // chuyển về Tabs (index)
                                }
                            ]
                        );
                    }
                } catch (error) {
                    console.log("Lỗi khi trừ tim:", error);
                }
                if (question.type === "ordering") setOrderAnswer([]);
            }
        } catch (err) {
            alert("Có lỗi khi kiểm tra đáp án!");
            if (question.type === "ordering") setOrderAnswer([]);
        } finally {
            setValidating(false);
        }
    };

    useEffect(() => {
        if (question?.type === "ordering" && orderAnswer.length === question.options.length) {
            handleAnswer(undefined, orderAnswer); // gửi lên server
        }
    }, [orderAnswer, question]);
    return (
        <View style={styles.container}>
            {/* Header giống index */}
            <View style={styles.header}>
                <View style={styles.headerStats}>
                    <View style={styles.leftStats}>
                        <View style={styles.flag} />
                    </View>
                    <View style={styles.rightStats}>
                        <View style={styles.statItem}>
                            <Flame size={17} color="#ff0000ff" fill="#f6660dff" />
                            {loading && <Text style={styles.statText}></Text>}
                            {error && <Text>{error}</Text>}
                            {hearts && <Text style={styles.statText}>{hearts.data?.hearts}</Text>}
                        </View>
                        <View style={styles.statItem}>
                            <Shield size={17} color="#FFFFFF" />
                            <Text style={styles.statText}>630</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Hiển thị câu hỏi và đáp án */}
            {!showResult && question && (
                <View style={{ marginBottom: 40 }}>
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>
                            {question.question}
                        </Text>
                    </View>
                    <View style={styles.answersContainer}>
                        {question.options && question.options.map((option: string, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.answerBox}
                                activeOpacity={0.7}
                                onPress={() => handleAnswer(option)}
                                disabled={validating}
                            >
                                <Text style={styles.answerText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        {question.type === "fill_blank" && (
                            <View>
                                <TextInput
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: 10,
                                        padding: 14,
                                        fontSize: 16,
                                        marginBottom: 18,
                                        borderWidth: 1,
                                        borderColor: "#d1d5db",
                                    }}
                                    placeholder="Nhập đáp án..."
                                    value={fillBlankAnswer}
                                    onChangeText={setFillBlankAnswer}
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={[styles.answerBox, { backgroundColor: "#3B82F6" }]}
                                    onPress={() => handleAnswer()}
                                >
                                    <Text style={[styles.answerText, { color: "#fff" }]}>Kiểm tra</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {question.type === "ordering" && (
                            <View>
                                {question.options.map((option: string, idx: number) => {
                                    const selectedIndex = orderAnswer.indexOf(option);

                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.answerBox,
                                                { backgroundColor: selectedIndex !== -1 ? "#3B82F6" : "#fff" }
                                            ]}
                                            onPress={() => {
                                                if (!orderAnswer.includes(option)) {
                                                    setOrderAnswer(prev => [...prev, option]); // chỉ thêm vào state, không gọi API
                                                }
                                            }}
                                            disabled={validating}
                                        >
                                            <Text style={[
                                                styles.answerText,
                                                { color: selectedIndex !== -1 ? "#fff" : "#111827" }
                                            ]}>
                                                {option} {selectedIndex !== -1 ? selectedIndex + 1 : ""}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )}
                    </View>
                </View>
            )}
            {showResult && quizResult && (
                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>🎉 Quiz hoàn thành!</Text>
                    <Text style={[styles.questionText, { marginTop: 16 }]}>
                        Điểm hiện tại: {quizResult.current_score} / {quizResult.total_points}
                    </Text>
                    <Text style={styles.questionText}>
                        Điểm kiếm được: {quizResult.earned_points}
                    </Text>
                    <Text style={styles.questionText}>
                        {quizResult.passed ? "Bạn đã vượt qua bài Quiz ✅" : "Bạn chưa vượt qua bài Quiz ❌"}
                    </Text>
                </View>
            )}

            {/* Quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>⬅ Quay lại Timeline</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 54 + STATUSBAR_HEIGHT + 16, // tăng paddingTop để tránh header đè lên nội dung
        paddingHorizontal: 20,
    },
    quizQuestion: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        marginBottom: 18,
        lineHeight: 22,
    },
    header: {
        width: '100%',
        height: 54 + STATUSBAR_HEIGHT,
        backgroundColor: '#7C3AED',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: STATUSBAR_HEIGHT,
        paddingHorizontal: 16,
        marginBottom: 18,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        justifyContent: 'center',
    },
    headerStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0,
    },
    leftStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        width: 32,
        height: 20,
        backgroundColor: '#EF4444',
        borderRadius: 4,
    },
    rightStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 12,
    },
    statText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    questionBox: {
        backgroundColor: '#3B82F6',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
    },
    answersContainer: {
        marginBottom: 40,
    },
    answerBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    answerText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    backButton: {
        marginTop: 10,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#3B82F6',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#3B82F6',
    },
});