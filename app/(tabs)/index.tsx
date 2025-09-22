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
  return (
    <View style={styles.container}>
      <View style={styles.heartContainer}>

      </View>
      <Text style={styles.title}>Chào mừng đến App Lịch sử</Text>
      <Button title="Chơi ngay (Khách)" onPress={() => navigation.navigate("Quiz")} />
      <Button title="Đăng nhập / Đăng ký" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333232ff',
    paddingHorizontal: 10,
  },
  heartContainer: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 40,
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
  },
});
