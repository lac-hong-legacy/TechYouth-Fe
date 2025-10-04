import BackButton from '@/components/BackButton';
import { ENV } from "@/src/config/env";
import { fetchCharacterQuiz, heartUsers, loses, validateLessonAnswer } from "@/src/redux/thunks/authThunks";
import { useAppDispatch, useAppSelector } from '@/src/hooks/useAppDispatch';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { Flame, Trophy } from 'lucide-react-native';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type QuizScreenProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Tabs: undefined | {
        screen: string;
        params?: {
            quizResult?: {
                current_score: number;
                total_points: number;
                earned_points: number;
                passed: boolean;
            };
        };
    };
    NotFound: undefined;
    Quiz: { characterId: string }
};

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function QuizScreen() {
    const navigation = useNavigation<QuizScreenProp>();
    const route = useRoute<QuizScreenRouteProp>();
    const dispatch = useAppDispatch();
    const { characterId } = route.params;
    const { quizData, quizLoading } = useAppSelector((state) => state.dynasty);
    const { hearts } = useAppSelector((state: any) => state.auth);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [canSkip, setCanSkip] = useState(false);
    const [videoFinished, setVideoFinished] = useState(false);

    const [fillBlankAnswer, setFillBlankAnswer] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [orderAnswer, setOrderAnswer] = useState<string[]>([]);
    const [validating, setValidating] = useState(false);
    const [quizResult, setQuizResult] = useState<any>(null);

    const lesson = Array.isArray(quizData) && quizData.length > 0 ? quizData[0] : null;
    const questions = lesson?.questions || [];
    const question = questions[currentQuestionIdx] || null;
    const [submitted, setSubmitted] = useState(false);
    const videoRef = useRef<Video>(null);
    const [canGoNext, setCanGoNext] = useState(false);
    const [countdown, setCountdown] = useState(5); // 60 giây
    const [countdownStarted, setCountdownStarted] = useState(false);


    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [connectAnswer, setConnectAnswer] = useState<{ left: string, right: string }[]>([]);

    // xoay màng hình
    const [isFullScreen, setIsFullScreen] = useState(false);


    // Lấy quiz
    useEffect(() => {
        if (characterId) {
            dispatch(fetchCharacterQuiz(characterId));
        }
    }, [characterId]);

    // Load video
    useEffect(() => {
        if (lesson?.video_url) {
            setVideoUrl(`${ENV.API_URL}${lesson.video_url}`);
            setTimeout(() => setCanSkip(true), lesson.can_skip_after * 1000);
        }
    }, [lesson]);

    useEffect(() => {
        dispatch(heartUsers());
    }, [dispatch]);

    // Handle submit answer
    const handleAnswer = async (option?: string, orderingAnswer?: string[]) => {
        if (!lesson || !question || validating) return;
        setValidating(true);

        let answerValue = "";
        if (question.type === "multiple_choice") answerValue = option || "";
        if (question.type === "fill_blank") answerValue = fillBlankAnswer;
        if (question.type === "ordering" || question.type === "connect") {
            // Chỉ submit khi đủ đáp án
            if (!orderingAnswer || orderingAnswer.length !== question.options.length) {
                setValidating(false);
                return;
            }
            answerValue = JSON.stringify(orderingAnswer);
        }

        try {
            const res = await dispatch(validateLessonAnswer({
                lesson_id: lesson.id,
                question_id: question.id,
                answer: answerValue
            })).unwrap();
            console.log(res);

            setFillBlankAnswer("");
            setSelectedOption(null);
            setOrderAnswer([]);
            setSelectedLeft(null);    // <-- reset connect
            setConnectAnswer([]);     // <-- reset connect

            if (res.correct) {
                if (currentQuestionIdx < questions.length - 1) {
                    // còn câu hỏi -> chuyển sang câu tiếp theo
                    setCurrentQuestionIdx((prev) => prev + 1);
                    setSubmitted(false);
                } else {
                    // hết câu hỏi -> show Quiz hoàn thành  
                    setQuizResult(res);
                    setShowQuiz(true);

                    // hết câu hỏi -> navigate sang Profile kèm quizResult
                    navigation.getParent()?.setParams({
                        screen: "Profile", // nếu Profile nằm trong Tabs
                        params: {
                            quizResult: {
                                current_score: res.current_score,
                                total_points: questions.length * 10,
                                earned_points: res.earned_points ?? res.current_score,
                                passed: res.current_score >= (questions.length * 5),
                            },
                        },
                    });
                }
            } else {
                // sai -> báo lỗi, không chuyển câu
                Alert.alert("Thông báo", "Sai rồi, thử lại nhé!");
                try {
                    await dispatch(loses()).unwrap();
                    const updatedHearts = await dispatch(heartUsers()).unwrap();
                    if (updatedHearts.data?.hearts === 0) {
                        Alert.alert("Hết tim", "Bạn đã hết lửa hy vọng rồi! Quay về trang chính.", [
                            { text: "OK", onPress: () => navigation.navigate("Tabs") }
                        ]);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            alert("Có lỗi khi kiểm tra đáp án!");
        } finally {
            setValidating(false);
        }
    };

    const startCountdown = () => {
        if (countdownStarted) return; // đã chạy rồi thì thôi
        setCountdownStarted(true);
        setCanGoNext(false);
        setCountdown(5); // giảm xuống 5 giây
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanGoNext(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Ordering auto submit
    useEffect(() => {
        if ((question?.type === "ordering" || question?.type === "connect") &&
            orderAnswer.length === question.options.length &&
            !submitted) {
            setSubmitted(true);  // đánh dấu đã submit
            handleAnswer(undefined, orderAnswer);
        }
    }, [orderAnswer, question, submitted]);

    useEffect(() => {
        if (question?.type === "connect" && connectAnswer.length === Object.keys(question.metadata.pairs).length) {
            const answerObj: Record<string, string> = {};
            connectAnswer.forEach(a => answerObj[a.left] = a.right);
            handleAnswer(undefined, Object.entries(answerObj).map(([k, v]) => `${k}=>${v}`));
        }
    }, [connectAnswer, question]);

    useEffect(() => {
        const timer = setTimeout(() => setCanGoNext(true), 60000); // 60 giây
        return () => clearTimeout(timer);
    }, []);

    if (question && (question.type === "ordering" || question.type === "connect")) {
        console.log("Gửi dữ liệu:", orderAnswer);
        console.log("JSON:", JSON.stringify(orderAnswer));
    }

    if (!question) {
        return (
            <View style={styles.loading}>
                <Text>Đang tải câu hỏi...</Text>
            </View>
        );
    }

    // Loading
    if (quizLoading || (!showQuiz && !videoUrl)) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text>Đang tải...</Text>
            </View>
        );
    }


    // Render video
    if (!showQuiz && videoUrl) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#f4ecd8', // màu nền hợp với lịch sử
                padding: 16,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    position: 'absolute',
                    top: STATUSBAR_HEIGHT + 70,
                    left: 16,
                    zIndex: 20
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Tabs")}>
                        <BackButton />
                    </TouchableOpacity>
                </View>
                <View style={{
                    width: '100%',
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: '#3c3b3bff', // nền của chính khung video
                    elevation: 6,
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                }}>
                    <Video
                        ref={videoRef}
                        style={{ width: '100%', height: 240 }}
                        source={{ uri: videoUrl }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                            if (status.isLoaded && status.didJustFinish) setVideoFinished(true);

                            // Bắt đầu đếm khi video play
                            if ('isPlaying' in status && status.isPlaying && !canGoNext && countdown === 5) {
                                startCountdown();
                            }
                        }}

                    />
                </View>

                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <TouchableOpacity
                        style={[styles.nextBtn, { opacity: canGoNext ? 1 : 0.5 }]}
                        onPress={() => setShowQuiz(true)}
                        disabled={!canGoNext}
                    >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                            👉 Xem Quiz {!canGoNext ? `(${countdown}s)` : ""}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.nextBtn} onPress={() => videoRef.current?.replayAsync()}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>🔁 Xem lại video</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Quiz UI
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerStats}>
                    <View style={styles.leftStats}>
                        <Text style={{ fontSize: 20 }}>🇻🇳</Text>
                    </View>
                    <View style={styles.rightStats}>
                        <View style={styles.statItem}>
                            <Flame size={17} color="#ff0000ff" fill="#f6660dff" />
                            {hearts && <Text style={styles.statText}>{hearts.data?.hearts}</Text>}
                        </View>
                        <View style={styles.statItem}>
                            <Trophy size={17} color="#ff2200ff" fill="#ff6c0aff" />
                            <Text style={styles.statText}>150</Text>
                        </View>
                    </View>
                </View>
            </View>

            {!quizResult && question && (
                <View style={{ marginBottom: 40 }}>
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>{question.question}</Text>
                    </View>

                    <View style={styles.answersContainer}>
                        {question && question.type === "multiple_choice" && question.options.map((option: string, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.answerBox}
                                onPress={() => handleAnswer(option)}
                                disabled={validating}
                            >
                                <Text style={styles.answerText}>{option}</Text>
                            </TouchableOpacity>
                        ))}

                        {question && question.type === "fill_blank" && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập đáp án..."
                                    value={fillBlankAnswer}
                                    onChangeText={setFillBlankAnswer}
                                />
                                <TouchableOpacity
                                    style={[styles.answerBox, { backgroundColor: "#3B82F6" }]}
                                    onPress={() => handleAnswer()}
                                >
                                    <Text style={[styles.answerText, { color: "#fff" }]}>Kiểm tra</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {question && (question.type === "ordering" || question.type === "connect") && question.options.map((option: string, idx: number) => {
                            const selectedIndex = orderAnswer.indexOf(option);
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.answerBox, { backgroundColor: selectedIndex !== -1 ? "#3B82F6" : "#fff" }]}
                                    onPress={() => {
                                        setOrderAnswer(prev => {
                                            if (prev.includes(option)) {
                                                // Nếu đã chọn -> bỏ đi
                                                return prev.filter(o => o !== option);
                                            } else {
                                                // Chưa chọn -> thêm vào cuối
                                                return [...prev, option];
                                            }
                                        });
                                    }}
                                    disabled={validating}
                                >
                                    <Text style={[styles.answerText, { color: selectedIndex !== -1 ? "#fff" : "#111827" }]}>
                                        {option} {selectedIndex !== -1 ? selectedIndex + 1 : ""}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        {question.type === "connect" && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {/* Cột Left */}
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    {Object.keys(question.metadata.pairs).map((left, idx) => {
                                        const used = connectAnswer.some(a => a.left === left);
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                disabled={used}
                                                style={[styles.answerBox, { backgroundColor: used ? "#3B82F6" : "#fff" }]}
                                                onPress={() => setSelectedLeft(left)}
                                            >
                                                <Text style={{ color: used ? "#fff" : "#111827" }}>{left}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {/* Cột Right */}
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    {Object.values(question.metadata.pairs).map((right, idx) => {
                                        const used = connectAnswer.some(a => a.right === right);
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                disabled={used || !selectedLeft}
                                                style={[styles.answerBox, { backgroundColor: used ? "#3B82F6" : "#fff" }]}
                                                onPress={() => {
                                                    if (!selectedLeft) return;

                                                    if (question.metadata.pairs[selectedLeft] === right) {
                                                        setConnectAnswer(prev => [...prev, { left: selectedLeft, right: right as string }]);
                                                    } else {
                                                        alert("Sai nối, chọn lại!");
                                                    }

                                                    setSelectedLeft(null);
                                                }}
                                            >
                                                <Text style={{ color: used ? "#fff" : "#111827" }}>{right as string}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {quizResult && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>🎉 Quiz Hoàn Thành!</Text>

                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreText}>Điểm hiện tại</Text>
                        <Text style={styles.scoreValue}>{quizResult.current_score} / {quizResult.total_points}</Text>
                    </View>

                    <View style={styles.earnedBox}>
                        <Text style={styles.earnedText}>Điểm kiếm được</Text>
                        <Text style={styles.earnedValue}>{quizResult.earned_points}</Text>
                    </View>

                    <Text style={[
                        styles.passText,
                        { color: quizResult.passed ? '#4E342E' : '#B71C1C' }  // nâu đậm / đỏ
                    ]}>
                        {quizResult.passed ? "Bạn đã vượt qua bài Quiz ✅" : "Bạn chưa vượt qua bài Quiz ❌"}
                    </Text>

                    <TouchableOpacity
                        style={styles.backButtonResult}
                        onPress={() => navigation.popToTop()}
                    >
                        <Text style={styles.backButtonText}>⬅ Quay về Timeline</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4ecd8',
        paddingTop: 54 + STATUSBAR_HEIGHT + 16,
        paddingHorizontal: 20
    },
    header: {
        height: 54 + STATUSBAR_HEIGHT,
        backgroundColor: "#7C3AED",
        paddingTop: STATUSBAR_HEIGHT,
        paddingHorizontal: 16,
        marginBottom: 24,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        right: 0,
        justifyContent: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    headerStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftStats: { flexDirection: 'row', alignItems: 'center' },
    flag: { width: 32, height: 20, backgroundColor: '#EF4444', borderRadius: 4 },
    rightStats: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 12 },
    statText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
    questionBox: {
        backgroundColor: "#FFF8DC", // giấy cổ
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        color: "#111827",
        lineHeight: 26,
    },
    answersContainer: { marginBottom: 40 },
    answerBox: {
        backgroundColor: "#FFF8F0",
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 18,
        marginBottom: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D6CCC2",
        elevation: 2,
    },
    answerText: { fontSize: 16, fontWeight: '500', color: '#111827' },
    backButton: {
        marginTop: 20,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#7C3AED",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#7C3AED",
    },
    nextBtn: {
        padding: 16,
        backgroundColor: "#16A34A", // xanh lá
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    resultBox: {
        backgroundColor: "#F5F5DC", // vàng nhạt kiểu giấy cổ
        padding: 28,
        margin: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
        alignItems: "center",
        justifyContent: "center", // căn giữa
    },
    resultTitle: {
        fontSize: 26,
        fontWeight: "800",
        color: "#6D4C41", // nâu lịch sử
        marginBottom: 20,
        textAlign: "center",
    },
    scoreBox: {
        backgroundColor: "#FFF8DC", // vàng nhạt hơn
        padding: 18,
        borderRadius: 14,
        width: "80%",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreText: {
        fontSize: 14,
        color: '#5D4037',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#3E2723', // nâu đậm
    },
    earnedBox: {
        backgroundColor: '#FFEBCD', // vàng nhạt kiểu giấy cũ
        padding: 16,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
        marginBottom: 16,
    },
    earnedText: {
        fontSize: 14,
        color: '#E65100',
        marginBottom: 4,
    },
    earnedValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E65100',
    },
    passText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center', // căn giữas
    },
    backButtonResult: {
        marginTop: 20,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#a500ecff",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#ece5e3ff",
    },
});
