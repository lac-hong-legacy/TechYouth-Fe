import { useAppDispatch, useAppSelector } from '@/src/hooks/useAppDispatch';
import { fetchTimeline, heartUsers } from '@/src/redux/thunks/authThunks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Welcome: undefined;
    NotFound: undefined;
    Tabs: undefined;
    Quiz: { characterId: string }
    CharacterDetail: { characterId: string }
};


export const useTimeline = () => {
    const dispatch = useAppDispatch(); // ✅ Gọi dispatch bên trong hook
    const navigation = useNavigation<LoginScreenProp>();
    const { hearts, error } = useAppSelector((state: any) => state.auth);
    const { selectedCharacterId, dynasties, currentLesson, loading } = useAppSelector((state: any) => state.timeline);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchTimeline());
    }, [dispatch]);

    useEffect(() => {
        dispatch(heartUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Alert.alert('Lỗi', `Không thể tải dữ liệu: ${error}`, [
                { text: 'Thử lại', onPress: () => dispatch(fetchTimeline()) },
                { text: 'OK' }
            ]);
        }
    }, [error]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(heartUsers());
        } finally {
            setRefreshing(false);
        }
    };

    const handleShowCharacterDetail = () => {
        if (!selectedCharacterId) {
            Alert.alert("Thông báo", "Chưa chọn nhân vật nào.");
            return;
        }
        console.log('🚀 selectedCharacterId:', selectedCharacterId);
        // Chỉ điều hướng, màn hình CharacterDetail tự fetch
        navigation.navigate('CharacterDetail', { characterId: selectedCharacterId });
    };

    return {
        hearts,
        error,
        selectedCharacterId,
        dynasties,
        currentLesson,
        loading,
        refreshing,
        modalVisible,
        modalData,
        onRefresh,
        handleShowCharacterDetail,
        setModalVisible,
    };
};