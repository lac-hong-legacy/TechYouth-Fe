import { ENV } from "@/config/env";
import { AddheartUsers, heartUsers, StatsUser, UserProfile } from "@/modules/auth/store/authThunks";
import { useAppDispatch, useAppSelector } from '@/modules/hooks/useAppDispatch';
import { AuthContext } from '@/rootNavigator/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Award, Camera, Edit3, Flame, Medal, MoreVertical, Star, Timer, Trophy, User, Users, Zap } from 'lucide-react-native';
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
    const { hearts, loading, error, StatsInfo, profileUser, collection } = useAppSelector((state: any) => state.auth);

    const [modalVisible, setModalVisible] = useState(false);
    const [mainImage, setMainImage] = useState<any>(null);
    const getImageUrl = (item: any) => {
        if (!item.image_url || item.image_url.trim() === "") return null;
        return item.image_url.startsWith("http")
            ? item.image_url
            : `${ENV.API_URL}${item.image_url}`;
    };

    useEffect(() => {
        if (collection?.characters?.characters) {
            const firstImage = collection.characters.characters.find(
                (item: any) => item.image_url && item.image_url.trim() !== ""
            );
            setMainImage(firstImage || null);
        }
    }, [collection]);

    const handleReceiveHeart = () => {
        setAdVisible(false);
        setCountdown(5); // reset
        dispatch(AddheartUsers())
    };

    // Hàm khi người dùng efreskéo xuống để rh
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
                <View style={styles.coverPhoto}>
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
                    <Text style={styles.personalInfoTitle}>Tổng Quan</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statColumn}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => setConfirmVisible(true)}>
                            <Flame size={17} color="#ff0000ff" fill="#f6660dff" />
                            {loading && <Text style={styles.statLabel}>Loading...</Text>}
                            {error && <Text>{error}</Text>}
                            {hearts && <Text style={styles.statNumber}>{hearts.data?.hearts}</Text>}
                            <Text style={styles.statLabel}>Lửa hy vọng</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statColumn}>
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
                    <Text style={styles.personalInfoTitle}>Thống kê cá nhân</Text>
                </View>

                {/* Hàng 1 */}
                <View style={styles.statsContainer}>
                    {/* Thời gian chơi */}
                    <View style={styles.statColumn}>
                        <Timer color="#f5c06bff" size={24} />
                        <Text style={styles.statNumber}>
                            {StatsInfo?.data ? `${Math.floor((StatsInfo.data.total_play_time ?? 0) / 60)} phút` : "0 phút"}
                        </Text>
                        <Text style={styles.statLabel}>Thời gian chơi</Text>
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

                <View style={styles.statsContainer}>
                    <View style={styles.statColumn}>
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
                    <View style={styles.statColumn}>
                        <Medal color="#2ed573" size={24} />
                        <Text style={styles.statNumber}>{StatsInfo?.data?.rank ?? "-"}</Text>
                        <Text style={styles.statLabel}>Xếp hạng</Text>
                    </View>

                    {/* Level */}
                    <View style={styles.statColumn}>
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
                    <Text style={styles.personalInfoTitle}>Thành tựu - ảnh</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statColumn}>
                        {mainImage ? (
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Image
                                    source={{ uri: getImageUrl(mainImage)! }}
                                    style={{ width: 200, height: 200, borderRadius: 8 }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <Text>Chưa có ảnh nổi bật</Text>
                        )}

                        {/* Modal chứa tất cả ảnh */}
                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "rgba(0,0,0,0.9)",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <TouchableOpacity
                                    style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
                                </TouchableOpacity>

                                <ScrollView horizontal pagingEnabled>
                                    {collection?.characters?.characters.map((item: any, index: number) => {
                                        const url = getImageUrl(item);
                                        if (!url) return null;
                                        return (
                                            <View key={index} style={{ alignItems: "center", justifyContent: "center", marginHorizontal: 10 }}>
                                                <Image
                                                    source={{ uri: url }}
                                                    style={{ width: 300, height: 300, borderRadius: 8 }}
                                                    resizeMode="contain"
                                                />
                                                <Text style={{ color: "#fff", marginTop: 5 }}>{item.name}</Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </Modal>
                    </View>
                    <View style={styles.statColumn}>
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
                    <View style={styles.statColumn}>
                        <Timer color="#f5c06bff" size={24} fill="#f5c06bff" />
                        <Text style={styles.statNumber}>12:14</Text>
                        <Text style={styles.statLabel}>Thời gian</Text>
                    </View>
                    <View style={styles.statColumn}>
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
        backgroundColor: '#f4ecd8',
    },
    menuButton: {
        position: "absolute",
        top: 40,
        right: 16,
        zIndex: 10,
    },
    coverSection: {
        height: 200,
        backgroundColor: '#5a4dbf',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
    },
    coverPhoto: {
        flex: 1,
        justifyContent: 'flex-end', // giữ avatar ở dưới cùng
        paddingBottom: 16,          // khoảng cách từ đáy cover
        paddingHorizontal: 16,
        position: 'relative',       // để menuButton có thể absolute lên trên
    },
    avatarNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: -40,
        left: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        backgroundColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: '#888',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ff6b6b',
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userNameSection: {
        marginLeft: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: -23,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    scrollContent: {
        flex: 1,
        marginTop: 60, // = avatar height / 2 + padding
    },
    personalInfoHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    personalInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // chia đều 3 cột
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    statColumn: {
        flex: 1,                 // chia đều chiều rộng
        marginHorizontal: 4,     // khoảng cách giữa các cột
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 6,
        color: '#222',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
        color: '#777',
    },
    statImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        width: '90%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
    },
});
