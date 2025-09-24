import { fetchDynastyDetail } from "@/modules/auth/store/authThunks";
import { useAppDispatch, useAppSelector } from '@/modules/hooks/useAppDispatch';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Flame, Shield } from 'lucide-react-native';
import { useEffect } from "react";
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    const { selectedDynastyDetail, quizLoading, error } = useAppSelector((state) => state.dynasty);

    useEffect(() => {
        if (characterId) {
            dispatch(fetchDynastyDetail(characterId));
            console.log("✅ characterId received in QuizScreen:", characterId)
        }
    }, [characterId]);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerStats}>
                    <View style={styles.leftStats}>
                        <View style={styles.flag} />
                    </View>
                    <View style={styles.rightStats}>
                        <View style={styles.statItem}>
                            <Flame size={17} color="#ff0000ff" fill="#f6660dff" />
                            <Text style={styles.statText}>5</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Shield size={17} color="#FFFFFF" />
                            <Text style={styles.statText}>630</Text>
                        </View>
                    </View>
                </View>
            </View>
            {/* Câu hỏi */}
            <View style={styles.questionBox}>
                <Text style={styles.questionText}>
                    {selectedDynastyDetail?.description || 'Không có mô tả'}
                </Text>
            </View>

            {/* Đáp án */}
            <View style={styles.answersContainer}>
                {(selectedDynastyDetail?.achievements || []).slice(0, 4).map((achievement: string, idx: number) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.answerBox}
                        activeOpacity={0.7}
                        onPress={() => console.log("👉 Answer:", achievement)}
                    >
                        <Text style={styles.answerText}>{achievement}</Text>
                    </TouchableOpacity>
                ))}
            </View>

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