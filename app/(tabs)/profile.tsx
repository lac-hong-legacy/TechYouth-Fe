import { AddheartUsers, heartUsers, StatsUser, UserProfile } from "@/modules/auth/store/authThunks";
import { useAppDispatch, useAppSelector } from '@/modules/hooks/useAppDispatch';
import { AuthContext } from '@/rootNavigator/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Camera, Edit3, Flame, Heart, MoreVertical, Star, Timer, Trophy, User, Zap, Users, Medal, Award } from 'lucide-react-native';
import { useContext, useEffect, useState } from "react";
import { Alert, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Welcome: undefined;
    NotFound: undefined;
    Tabs: undefined
};

export default function ProfilrScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false); // popup xác nhận
    const [adVisible, setAdVisible] = useState(false); // popup quảng cáo
    const [countdown, setCountdown] = useState(5);
    const navigation = useNavigation<LoginScreenProp>();
    const dispatch = useAppDispatch();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const { hearts, loading, error, StatsInfo, profileUser } = useAppSelector((state: any) => state.auth);

    const handleReceiveHeart = () => {
        setAdVisible(false);
        setCountdown(5); // reset
        dispatch(AddheartUsers())
    };

    // Hàm khi người dùng kéo xuống để refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(heartUsers()); // gọi lại API load tim
        } finally {
            setRefreshing(false); // tắt loading sau khi xong
        }
    };

    // Đếm ngược 5s khi mở popup quảng cáo
    useEffect(() => {
        let timer: any;
        if (adVisible && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [adVisible, countdown]);

    useEffect(() => {
        dispatch(heartUsers());
        dispatch(UserProfile());
        dispatch(StatsUser());
        console.log("dddddddddddd", hearts);
    }, [dispatch])


    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <View style={styles.coverSection}>
                <View style={styles.coverPhoto}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() =>
                            Alert.alert(
                                "Tùy chọn",
                                "Bạn có chắc muốn đăng xuất?",
                                [
                                    { text: "Hủy", style: "cancel" },
                                    { text: "Đăng xuất", style: "destructive", onPress: handleLogout }
                                ]
                            )
                        }
                    >
                        <MoreVertical color="#fff" size={22} />
                    </TouchableOpacity>
                    <View style={styles.avatarNameRow}>
                        {/* Avatar */}
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                {/* Avatar Image */}
                            </View>
                            <TouchableOpacity style={styles.cameraButton}>
                                <Camera color="#ffffffff" size={16} />
                            </TouchableOpacity>
                        </View>

                        {/* User Name */}
                        <View style={styles.userNameSection}>
                            {profileUser && <Text style={styles.userName}>{profileUser.data?.username}</Text>}
                            <TouchableOpacity>
                                <Edit3 color="#888" size={16} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.personalInfoHeader}>
                    <Text style={styles.personalInfoTitle}>Thống kê cá nhân</Text>
                </View>

                {/* Hàng 1 */}
                <View style={styles.statsContainer}>
                    {/* Thời gian chơi */}
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Timer color="#f5c06bff" size={24} />
                        <Text style={styles.statNumber}>
                            {StatsInfo?.data ? `${Math.floor((StatsInfo.data.total_play_time ?? 0) / 60)} phút` : "0 phút"}
                        </Text>
                        <Text style={styles.statLabel}>Thời gian chơi</Text>
                    </View>

                    {/* Bài học */}
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Star color="#c8c811ff" size={24} />
                        <Text style={styles.statNumber}>
                            {StatsInfo?.data?.completed_lessons ?? 0}
                        </Text>
                        <Text style={styles.statLabel}>Bài học</Text>
                    </View>

                    {/* Streak */}
                    <View style={styles.statColumn}>
                        <Trophy color="#ff4757" size={24} />
                        <Text style={styles.statNumber}>
                            {StatsInfo?.data?.streak ?? 0}🔥
                        </Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </View>
                </View>

                {/* Hàng 2 */}
                <View style={styles.statsContainer}>
                    {/* Hearts */}
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Heart color="#ff4757" size={24} fill="#ff4757" />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.hearts ?? 0}</Text>
                        <Text style={styles.statLabel}>Mạng</Text>
                    </View>

                    {/* XP */}
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Star color="#00c3ff" size={24} />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.xp ?? 0}</Text>
                        <Text style={styles.statLabel}>Kinh nghiệm</Text>
                    </View>

                    {/* Thành tựu */}
                    <View style={styles.statColumn}>
                        <Award color="#ffa502" size={24} />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.achievements ?? 0}</Text>
                        <Text style={styles.statLabel}>Thành tựu</Text>
                    </View>
                </View>

                {/* Hàng 3 */}
                <View style={styles.statsContainer}>
                    {/* Rank */}
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Medal color="#2ed573" size={24} />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.rank ?? "-"}</Text>
                        <Text style={styles.statLabel}>Xếp hạng</Text>
                    </View>

                    {/* Level */}
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Trophy color="#1abc9c" size={24} />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.level ?? 0}</Text>
                        <Text style={styles.statLabel}>Cấp độ</Text>
                    </View>

                    {/* Unlocked characters */}
                    <View style={styles.statColumn}>
                        <Users color="#8e44ad" size={24} />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.unlocked_characters ?? 0}</Text>
                        <Text style={styles.statLabel}>Nhân vật mở khóa</Text>
                    </View>
                </View>

                {/* Hàng 4 */}
                <View style={styles.statsContainer}>
                    {/* Spirit (type + stage) */}
                    <View style={styles.statColumn}>
                        <Zap color="#f07b0eff" size={24} />
                        <Text style={styles.statNumber}>
                            {StatsInfo?.data?.spirit_type ?? "-"} (Stage {StatsInfo?.data?.spirit_stage ?? "-"})
                        </Text>
                        <Text style={styles.statLabel}>Tinh thần</Text>
                    </View>
                </View>


                <View style={styles.personalInfoHeader}>
                    <Text style={styles.personalInfoTitle}>Thông tin cá nhân</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => setConfirmVisible(true)}>
                            <Heart color="#ff4757" size={24} fill="#ff4757" />
                            {loading && <Text style={styles.statLabel}>Loading...</Text>}
                            {error && <Text>{error}</Text>}
                            {hearts && <Text style={styles.statNumber}>{hearts.data?.hearts}</Text>}
                            <Text style={styles.statLabel}>Lửa hy vọng</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <User color="#feb341ff" size={25} fill="#feb341ff" />
                        <Text style={styles.statNumber}>1.570</Text>
                        <Text style={styles.statLabel}>Theo dõi</Text>
                    </View>
                    <View style={styles.statColumn}>
                        <Users color="#475fffff" size={24} fill="#475fffff" />
                        <Text style={styles.statNumber}>4.095</Text>
                        <Text style={styles.statLabel}>Bạn bè</Text>
                    </View>
                </View>

                <View style={styles.personalInfoHeader}>
                    <Text style={styles.personalInfoTitle}>Thành tựu</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Image source={require("@/assets/images/anh2-removebg-preview.png")} style={styles.statImage} />
                        <Text style={styles.statLabel}>Nhân vật</Text>
                    </View>
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Image source={require("@/assets/images/icon-cao-removebg-preview.png")} style={styles.statImage} />
                        <Text style={styles.statLabel}>Theo dõi</Text>
                    </View>
                    <View style={styles.statColumn}>
                        <Image source={require("@/assets/images/anh1-removebg-preview.png")} style={styles.statImage} />
                        <Text style={styles.statLabel}>Danh hiệu</Text>
                    </View>
                </View>

                <View style={styles.personalInfoHeader}>
                    <Text style={styles.personalInfoTitle}>Bài tập đã làm</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Timer color="#f5c06bff" size={24} fill="#f5c06bff" />
                        <Text style={styles.statNumber}>12:14</Text>
                        <Text style={styles.statLabel}>Thời gian</Text>
                    </View>
                    <View style={[styles.statColumn, styles.borderRight]}>
                        <Star color="#c8c811ff" size={24} fill="#c8c811ff" />
                        <Text style={styles.statNumber}>95</Text>
                        <Text style={styles.statLabel}>Điểm</Text>
                    </View>
                    <View style={styles.statColumn}>
                        <Trophy color="#ff4757" size={24} fill="#ff4757" />
                        <Text style={styles.statNumber}>Tuyệt vời</Text>
                        <Text style={styles.statLabel}>Đánh giá</Text>
                    </View>
                </View>
            </ScrollView>
            {/* Popup xác nhận */}
            <Modal transparent visible={confirmVisible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalText}>
                            Bạn có muốn xem quảng cáo để được thêm tim không?
                        </Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: "green" }]}
                                onPress={async () => {
                                    setConfirmVisible(false);
                                    setAdVisible(true);
                                    setCountdown(5); // reset countdown

                                }}
                            >
                                <Text style={styles.btnText}>Có</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: "red" }]}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Text style={styles.btnText}>Không</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Popup quảng cáo */}
            <Modal transparent visible={adVisible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        {countdown > 0 ? (
                            <Text style={styles.modalText}>
                                Đang xem quảng cáo... {countdown}s
                            </Text>
                        ) : (
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: "blue" }]}
                                onPress={handleReceiveHeart}
                            >
                                <Text style={styles.btnText}>Nhận tim</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    menuButton: {
        position: "absolute",
        top: 40,    // canh xuống một chút để không đụng status bar
        right: 0,
        padding: 5,
        zIndex: 10,
    },
    coverSection: {
        position: 'relative',
        height: 200,
        backgroundColor: '#444',
        paddingHorizontal: 16,
    },
    scrollContent: {
        flex: 1,
        marginTop: 50,
    },
    coverPhoto: {
        flex: 1,
        justifyContent: 'flex-end', // để avatar + tên nằm dưới cover
    },
    avatarNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: -30, // hạ avatar xuống, đè lên khung tên
        left: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
        backgroundColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#888',
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userNameSection: {
        position: 'absolute',
        top: 20, // nhích xuống dưới avatar, avatar vẫn như cũ
        left: 90, // cách avatar một chút (avatar width 80 + khoảng cách)
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#ddd7d7ff',
        backgroundColor: '#717171ff',
    },
    personalInfoHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    personalInfoTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    statColumn: {
        flex: 1,
        paddingVertical: 24,
        alignItems: 'center',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    statNumber: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
    },
    statImage: {
        width: 150,
        height: 150,      // chiều cao vừa với khung
        resizeMode: 'contain', // giữ tỉ lệ ảnh
        marginBottom: 4, // khoảng cách với label
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        width: 300,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    btnText: {
        color: "white",
        fontWeight: "600",
    },
})