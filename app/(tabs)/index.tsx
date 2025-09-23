import ProgressHeader from '@/components/ProgressHeader';
import { useGuest } from '@/modules/guest';
import { useAppSelector } from '@/modules/hooks/useAppDispatch';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, StyleSheet, Text, View } from 'react-native';


type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Tabs'>;

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Tabs: undefined;
  NotFound: undefined;
  Quiz: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<LoginScreenProp>();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const { isGuestMode, hasReachedGuestLimit } = useGuest();

  // Note: Guest session initialization is now handled by AuthContext
  // No need to manually initialize here

  const handlePlayAsGuest = () => {
    if (hasReachedGuestLimit()) {
      // Show registration prompt
      navigation.navigate("Login");
    } else {
      navigation.navigate("Quiz");
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <ProgressHeader />
      
      <View style={styles.content}>
        <Text style={styles.title}>Chào mừng đến App Lịch sử</Text>
        
        {isGuestMode && (
          <View style={styles.guestInfo}>
            <Text style={styles.guestInfoText}>
              {hasReachedGuestLimit() 
                ? "Bạn đã hoàn thành 2 bài học miễn phí! Đăng ký để tiếp tục." 
                : "Chế độ khách - Bạn có thể học 2 bài miễn phí"
              }
            </Text>
          </View>
        )}

        <Button 
          title={hasReachedGuestLimit() ? "Đăng ký để tiếp tục" : "Chơi ngay"} 
          onPress={handlePlayAsGuest} 
        />
        
        {!hasReachedGuestLimit() && (
          <Button 
            title="Đăng nhập / Đăng ký" 
            onPress={() => navigation.navigate("Login")} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333232ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  guestInfo: {
    backgroundColor: 'rgba(255, 165, 2, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFA502',
  },
  guestInfoText: {
    color: '#FFA502',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
