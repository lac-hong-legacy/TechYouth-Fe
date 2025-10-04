import { dynasties, eras } from '@/src/redux/thunks/authThunks';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useAppDispatch';
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const windowHeight = Dimensions.get('window').height;

export default function EventScreen() {
    const dispatch = useAppDispatch();
    const { dynastyList, eraList, loadingDynasties, loadingEras } = useAppSelector((state) => state.dynasty);
    const [showDynasties, setShowDynasties] = useState(false);
    const [showEras, setShowEras] = useState(false);

    useEffect(() => {
        dispatch(dynasties());
        dispatch(eras());
    }, [dispatch]);

    const getListHeight = (dataLength: number, itemHeight = 50) => {
        const totalHeight = dataLength * itemHeight;
        const maxHeight = windowHeight * 0.7; // tăng giới hạn danh sách tối đa lên 70% màn hình
        const minHeight = 80; // optional: danh sách ngắn cũng có chút chiều cao
        return Math.min(totalHeight, maxHeight) + 20; // +20 để nhìn “dài thêm xíu”
    };

    const renderList = (data: string[], loading: boolean) => {
        if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
        return data.map((item) => (
            <View key={item} style={styles.card}>
                <Text style={styles.cardText}>{item}</Text>
            </View>
        ));
    };
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>📚 Niên Đại & Triều Đại Lịch Sử</Text>

            {/* Niên đại */}
            <TouchableOpacity onPress={() => setShowEras(!showEras)}>
                <Text style={styles.sectionTitle}>
                    📜 Niên đại {showEras ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>
            {showEras && (
                <ScrollView
                    style={[styles.listContainer, { height: getListHeight(eraList.length) }]}
                    nestedScrollEnabled
                >
                    {renderList(eraList, loadingEras)}
                </ScrollView>
            )}

            {/* Triều đại */}
            <TouchableOpacity onPress={() => setShowDynasties(!showDynasties)}>
                <Text style={styles.sectionTitle}>
                    🏛️ Triều đại {showDynasties ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>
            {showDynasties && (
                <ScrollView
                    style={[styles.listContainer, { height: getListHeight(dynastyList.length) }]}
                    nestedScrollEnabled
                >
                    {renderList(dynastyList, loadingDynasties)}
                </ScrollView>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4ecd8', padding: 16, paddingTop: 50 },
    header: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 20, color: '#5c3aa0ff', textShadowColor: '#C9B77C', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3 },
    sectionTitle: { fontSize: 20, fontWeight: '600', marginVertical: 10, color: '#6B4B9A', paddingVertical: 6 },
    loadingText: { fontSize: 16, fontStyle: 'italic', color: '#888', paddingLeft: 10 },
    listContainer: { marginBottom: 12, borderWidth: 1, borderColor: '#d4c2a8', borderRadius: 12, backgroundColor: '#fff8e1', paddingVertical: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
    card: { padding: 12, marginVertical: 4, marginHorizontal: 8, borderRadius: 8, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1 },
    cardText: { fontSize: 16, color: '#333' },
})