import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { fetchDynastyDetail } from '@/src/redux/thunks/authThunks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
    CharacterDetail: { characterId: string };
    Tabs: undefined;
    Quiz: undefined;
};

type CharacterDetailRouteProp = RouteProp<RootStackParamList, 'CharacterDetail'>;
type CharacterDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CharacterDetail'>;

interface HeaderProps {
    title: string;
    onClose: () => void;
    onSpeak: () => void;
}

const CharacterDetailHeader = ({ title, onClose, onSpeak }: HeaderProps) => (
    <View style={headerStyles.container}>
        <View style={headerStyles.topBar}>
            <TouchableOpacity onPress={onClose} style={headerStyles.closeButton}>
                <Text style={headerStyles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={headerStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onSpeak} style={headerStyles.speakButton}>
                <Text style={headerStyles.speakText}>🔊</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function CharacterDetailScreen() {
    const route = useRoute<CharacterDetailRouteProp>();
    const navigation = useNavigation<CharacterDetailNavigationProp>();
    const { characterId } = route.params;
    const dispatch = useAppDispatch();

    const [character, setCharacter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [ttsReady, setTtsReady] = useState(false);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const detail = await dispatch(fetchDynastyDetail(characterId)).unwrap();
                setCharacter(detail.data || detail);
            } catch (err) {
                console.error(err);
                Alert.alert('Lỗi', 'Không thể tải thông tin nhân vật');
            } finally {
                setLoading(false);
            }
        };
        fetchCharacter();
    }, [characterId, dispatch]);

    Speech.getAvailableVoicesAsync().then(voices => {
        console.log("Available voices:", voices);
    })

    const handleSpeak = () => {
        if (!character) return;

        // Tạo mảng các đoạn text để đọc tuần tự
        const paragraphs: string[] = [
            `${character.name || 'Chưa có tên'}.`,
            `${character.description || 'Chưa có mô tả'}.`,
            character.era ? `Thời kỳ: ${character.era}.` : '',
            character.dynasty ? `Triều đại: ${character.dynasty}.` : '',
            `${character.birth_year || '?'} - ${character.death_year || '?'}.`,

            // Sử liệu Việt Nam
            `Trong sử liệu Việt Nam, Hùng Vương được nhắc đến trong Lĩnh Nam chích quái (đời Lý-Trần) cùng truyền thuyết Âu Cơ-Lạc Long Quân.
Đại Việt sử lược đời Trần cũng có ghi chép: "Đến đời Trang Vương nhà Chu (696-682 TCN) ở bộ Gia Ninh có người lạ, dùng ảo thuật qui phục được các bộ lạc, tự xưng là Hùng Vương đóng đô ở Văn Lang, đặt quốc hiệu là Văn Lang, phong tục thuần lương chơn chất, chính sự dùng lối thắt gút. Truyền được 18 đời đều xưng là Hùng Vương (có bản dịch là Đối Vương, 碓王)."`,

            `Đại Việt sử ký toàn thư thời Hậu Lê chính thức đưa Hùng Vương làm quốc tổ.`,

            // Sử liệu Trung Quốc
            `Trong sử liệu Trung Quốc, danh xưng "Hùng Vương" được ghi chép trong sách Thái Bình quảng ký, thế kỷ thứ X, dẫn Nam Việt chí khoảng thế kỷ V: "Vùng đất Giao Chỉ rất màu mỡ, di dân đến ở, thoạt đầu biết trồng cấy. Đất đen xốp. Khí đất hùng (mạnh). Vì vậy ruộng ấy gọi là ruộng Hùng, dân ấy là dân Hùng."`,

            `Các sách Cựu Đường thư, Nam Việt liệt truyện cũng ghi lại chức Lạc Vương – Lạc Hầu, Lạc tướng, cùng nhiều chức vụ khác, tương tự Hùng Vương ở Việt Nam. Hai chữ Hùng Vương (雄王) và Lạc Vương (雒王) đôi khi bị nhầm lẫn trong ghi chép.`,

            // Truyền thuyết
            `Truyền thuyết: Hùng Vương thứ I là con trai của Lạc Long Quân, lên ngôi vào năm 2524 TCN, đặt quốc hiệu là Văn Lang, chia nước làm 15 bộ, truyền đời đến năm 258 TCN thì bị Thục Phán (An Dương Vương) của tộc Âu Việt chiếm mất nước.`,

            `Xưa, cháu ba đời của Viêm Đế họ Thần Nông là Đế Minh sinh ra Đế Nghi. Đế Minh nhân đi tuần phương Nam, đến Ngũ Lĩnh lấy con gái Vụ Tiên, sinh ra Lộc Tục. Lộc Tục được phong làm Kinh Dương Vương, cai quản phương Nam, các bộ tộc Bách Việt, gọi là nước Xích Quỷ.`,

            `Kinh Dương Vương xuống Thủy phủ, lấy con gái Long Vương Động Đình Quân là Thần Long Long Nữ sinh ra Lạc Long Quân. Lạc Long Quân trở về cai trị Xích Quỷ. Âu Cơ – con gái Đế Lai – ở lại cùng với Lạc Long Quân sinh ra trăm trứng, trăm con trai. Âu Cơ giữ 50 con ở Phong Châu, con trưởng lên làm vua lấy hiệu Hùng Vương.`,

            // Sự nghiệp
            `Sự nghiệp: Hùng Vương lên ngôi, đặt quốc hiệu là Văn Lang, chia nước ra làm 15 bộ: Giao Chỉ, Chu Diên, Vũ Ninh, Phúc Lộc, Việt Thường, Ninh Hải, Dương Tuyền, Lục Hải, Vũ Định, Hoài Hoan, Cửu Chân, Bình Văn, Tân Hưng, Cửu Đức; đóng đô ở bộ Văn Lang, Phong Châu.`,

            `Hùng Vương sai các em trai phân trị, đặt em thứ làm Tướng võ (Lạc Tướng), Tướng văn (Lạc Hầu), con trai vua gọi là Quan Lang, con gái vua gọi là Mị Nương. Quan Hữu ty gọi là Bố Chính, thần bộc, nô lệ gọi là nô tỳ.`,

            // Lãnh thổ
            `Lãnh thổ: Lãnh thổ của nước Văn Lang được xác định ở khu vực đồng bằng sông Hồng, phía đông bắc giáp Âu Việt, phía tây bắc thuộc các tỉnh miền Bắc Việt Nam và một phần Quảng Tây, Trung Quốc, phía đông giáp biển Đông, phía tây tiếp giáp dãy núi Hoàng Liên Sơn, phía nam giáp Hồ Tôn Tinh (Champa cổ). Dân số khoảng 40-50 vạn người.`,

            // Văn hóa
            `Văn hóa: Thời Lạc Long Quân trị vì, nhà vua dạy dân ăn mặc, có trật tự vua tôi, tôn ti, luân thường đạo lý. Dân ở rừng núi xuống sông ngòi đánh cá, phòng tránh giao long bằng cách xăm hình thủy quái. Ban đầu dùng vỏ cây làm áo, cốt gạo làm rượu, cây quang lang làm bánh, dùng cầm thú, cá tôm làm nước mắm. Trai gái cưới nhau dùng muối làm lễ hỏi, giết trâu làm lễ thành hôn, ăn cơm nếp cùng nhau.`,

            // Ngoại giao
            `Ngoại giao: Năm 2557-2258 TCN, Hùng Vương sai sứ sang tặng vua Nghiêu con rùa thần, trên lưng có văn khoa đẩu ghi việc từ khi trời đất mới mở. Vua Nghiêu sai chép lấy gọi là Quy lịch. Năm 1110 TCN, xứ Việt Thường sai sứ tặng Chu Thành vương một con chim trĩ trắng.`,

            // Mười lăm bộ
            `Mười lăm bộ: Giao Chỉ, Chu Diên, Vũ Ninh, Phúc Lộc, Việt Thường, Ninh Hải, Dương Tuyền, Lục Hải, Vũ Định, Hoài Hoan, Cửu Chân, Bình Văn, Tân Hưng, Cửu Đức. Đóng đô ở bộ Văn Lang.`,

            // Danh ngôn
            `Danh ngôn: ${character.famous_quote || 'Chưa có'}.`
        ];

        // Dừng TTS trước khi đọc
        Speech.stop();

        // Đọc tuần tự các đoạn
        const speakSequentially = async (texts: string[], index = 0) => {
            if (index >= texts.length) return;
            Speech.speak(texts[index], {
                language: 'vi-VN',
                rate: 1.0,
                pitch: 1.0,
                onDone: () => {
                    speakSequentially(paragraphs, index + 1); // gọi tiếp tục tuần tự
                }
            });
        };

        speakSequentially(paragraphs);
    };
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!character) {
        return (
            <View style={styles.centered}>
                <Text>Không có thông tin nhân vật</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CharacterDetailHeader
                title="Thông Nhân Vật"
                onClose={() => navigation.goBack()}
                onSpeak={handleSpeak}
            />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.title}>📜 {character.name || 'Chưa có tên'}</Text>

                <Text style={styles.text}>🏰 {character.era || '?'}</Text>

                <Text style={styles.text}>👑 {character.dynasty || '?'}</Text>

                <Text style={styles.text}>
                    📅 Năm sinh - mất: {character.birth_year || '?'} - {character.death_year || '?'}
                </Text>

                <Text style={[styles.text, { marginTop: 10 }]}>
                    📝 Mô tả: {character.description || 'Chưa có mô tả'}
                </Text>

                {/* Sử liệu Việt Nam */}
                <Text style={styles.text}>
                    Trong sử liệu Việt Nam, Hùng Vương được nhắc đến trong Lĩnh Nam chích quái (đời Lý-Trần) cùng truyền thuyết Âu Cơ-Lạc Long Quân.
                    Đại Việt sử lược đời Trần cũng có ghi chép: "Đến đời Trang Vương nhà Chu (696-682 TCN) ở bộ Gia Ninh có người lạ, dùng ảo thuật qui phục được các bộ lạc, tự xưng là Hùng Vương đóng đô ở Văn Lang, đặt quốc hiệu là Văn Lang, phong tục thuần lương chơn chất, chính sự dùng lối thắt gút. Truyền được 18 đời đều xưng là Hùng Vương (có bản dịch là Đối Vương, 碓王)."
                </Text>

                <Text style={styles.text}>
                    Đại Việt sử ký toàn thư thời Hậu Lê chính thức đưa Hùng Vương làm quốc tổ.
                </Text>

                {/* Sử liệu Trung Quốc */}
                <Text style={styles.text}>
                    Trong sử liệu Trung Quốc, danh xưng "Hùng Vương" được ghi chép trong sách Thái Bình quảng ký, thế kỷ thứ X, dẫn Nam Việt chí khoảng thế kỷ V: "Vùng đất Giao Chỉ rất màu mỡ, di dân đến ở, thoạt đầu biết trồng cấy. Đất đen xốp. Khí đất hùng (mạnh). Vì vậy ruộng ấy gọi là ruộng Hùng, dân ấy là dân Hùng."
                </Text>

                <Text style={styles.text}>
                    Các sách Cựu Đường thư, Nam Việt liệt truyện cũng ghi lại chức Lạc Vương – Lạc Hầu, Lạc tướng, cùng nhiều chức vụ khác, tương tự Hùng Vương ở Việt Nam. Hai chữ Hùng Vương (雄王) và Lạc Vương (雒王) đôi khi bị nhầm lẫn trong ghi chép.
                </Text>

                <View style={styles.images}>
                    <Image source={require("@/assets/images/anhHung_Vuong.jpg")} style={styles.image} />
                </View>

                {/* Truyền thuyết */}
                <Text style={[styles.text, { marginTop: 10 }]}>
                    🏞️ Truyền thuyết:
                </Text>

                <Text style={styles.text}>
                    Hùng Vương thứ I là con trai của Lạc Long Quân, lên ngôi vào năm 2524 TCN, đặt quốc hiệu là Văn Lang, chia nước làm 15 bộ, truyền đời đến năm 258 TCN thì bị Thục Phán (An Dương Vương) của tộc Âu Việt chiếm mất nước.
                </Text>

                <Text style={styles.text}>
                    Xưa, cháu ba đời của Viêm Đế họ Thần Nông là Đế Minh sinh ra Đế Nghi. Đế Minh nhân đi tuần phương Nam, đến Ngũ Lĩnh lấy con gái Vụ Tiên, sinh ra Lộc Tục. Lộc Tục được phong làm Kinh Dương Vương, cai quản phương Nam, các bộ tộc Bách Việt, gọi là nước Xích Quỷ.
                </Text>

                <Text style={styles.text}>
                    Kinh Dương Vương xuống Thủy phủ, lấy con gái Long Vương Động Đình Quân là Thần Long Long Nữ sinh ra Lạc Long Quân. Lạc Long Quân trở về cai trị Xích Quỷ. Âu Cơ – con gái Đế Lai – ở lại cùng với Lạc Long Quân sinh ra trăm trứng, trăm con trai. Âu Cơ giữ 50 con ở Phong Châu, con trưởng lên làm vua lấy hiệu Hùng Vương.
                </Text>

                {/* Sự nghiệp */}
                <Text style={[styles.text, { marginTop: 10 }]}>
                    🏯 Sự nghiệp:
                </Text>

                <Text style={styles.text}>
                    Hùng Vương lên ngôi, đặt quốc hiệu là Văn Lang, chia nước ra làm 15 bộ: Giao Chỉ, Chu Diên, Vũ Ninh, Phúc Lộc, Việt Thường, Ninh Hải, Dương Tuyền, Lục Hải, Vũ Định, Hoài Hoan, Cửu Chân, Bình Văn, Tân Hưng, Cửu Đức; đóng đô ở bộ Văn Lang, Phong Châu.
                </Text>

                <Text style={styles.text}>
                    Hùng Vương sai các em trai phân trị, đặt em thứ làm Tướng võ (Lạc Tướng), Tướng văn (Lạc Hầu), con trai vua gọi là Quan Lang, con gái vua gọi là Mị Nương. Quan Hữu ty gọi là Bố Chính, thần bộc, nô lệ gọi là nô tỳ.
                </Text>

                {/* Lãnh thổ */}
                <Text style={[styles.text, { marginTop: 10 }]}>
                    🌍 Lãnh thổ:
                </Text>

                <Text style={styles.text}>
                    Lãnh thổ của nước Văn Lang được xác định ở khu vực đồng bằng sông Hồng, phía đông bắc giáp Âu Việt, phía tây bắc thuộc các tỉnh miền Bắc Việt Nam và một phần Quảng Tây, Trung Quốc, phía đông giáp biển Đông, phía tây tiếp giáp dãy núi Hoàng Liên Sơn, phía nam giáp Hồ Tôn Tinh (Champa cổ). Dân số khoảng 40-50 vạn người.
                </Text>

                {/* Văn hóa */}
                <Text style={[styles.text, { marginTop: 10 }]}>
                    🎎 Văn hóa:
                </Text>

                <Text style={styles.text}>
                    Thời Lạc Long Quân trị vì, nhà vua dạy dân ăn mặc, có trật tự vua tôi, tôn ti, luân thường đạo lý. Dân ở rừng núi xuống sông ngòi đánh cá, phòng tránh giao long bằng cách xăm hình thủy quái. Ban đầu dùng vỏ cây làm áo, cốt gạo làm rượu, cây quang lang làm bánh, dùng cầm thú, cá tôm làm nước mắm. Trai gái cưới nhau dùng muối làm lễ hỏi, giết trâu làm lễ thành hôn, ăn cơm nếp cùng nhau.
                </Text>

                {/* Ngoại giao */}
                <Text style={[styles.text, { marginTop: 10 }]}>
                    📨 Ngoại giao:
                </Text>

                <Text style={styles.text}>
                    Năm 2557-2258 TCN, Hùng Vương sai sứ sang tặng vua Nghiêu con rùa thần, trên lưng có văn khoa đẩu ghi việc từ khi trời đất mới mở. Vua Nghiêu sai chép lấy gọi là Quy lịch. Năm 1110 TCN, xứ Việt Thường sai sứ tặng Chu Thành vương một con chim trĩ trắng.
                </Text>

                {/* Mười lăm bộ */}
                <Text style={[styles.text, { marginTop: 10 }]}>
                    🗺️ Mười lăm bộ:
                </Text>

                <Text style={styles.text}>
                    Giao Chỉ, Chu Diên, Vũ Ninh, Phúc Lộc, Việt Thường, Ninh Hải, Dương Tuyền, Lục Hải, Vũ Định, Hoài Hoan, Cửu Chân, Bình Văn, Tân Hưng, Cửu Đức. Đóng đô ở bộ Văn Lang.
                </Text>

                <Text style={styles.quoteText}>
                    💡 Danh ngôn: "{character.famous_quote || 'Chưa có'}"
                </Text>

            </ScrollView>
        </View>
    );
}

const headerStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f1e4c1ff',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginTop: 30, // đẩy header xuống
    },
    closeButton: {
        width: 40,
        alignItems: 'center',
    },
    closeText: {
        fontSize: 20,
        color: '#000000ff',
    },
    title: {
        fontSize: 18,
        color: '#000000ff',
        fontWeight: 'bold',
    },
    speakButton: { width: 40, alignItems: 'center' },
    speakText: { fontSize: 20, color: '#000' },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4ecd8',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#000000ff',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 10,
    },
    text: {
        color: '#000000ff',
        marginBottom: 5,
        fontSize: 16,
    },
    achievementText: {
        color: '#000000ff',
        marginLeft: 16,
        marginTop: 4,
        fontSize: 16,
    },
    quoteText: {
        color: '#000000ff',
        marginTop: 10,
        fontStyle: 'italic',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    images: {
        marginVertical: 1,
    },
    image: {
        width: '100%',
        height: undefined, // để aspectRatio hoạt động
        aspectRatio: 0.5,  // tỉ lệ dọc 1:2
        resizeMode: 'contain', // quan trọng: hiển thị hết ảnh
    }
});
