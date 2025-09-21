import { useAppSelector } from '@/modules/hooks/useAppDispatch';
import { Button, StyleSheet, Text, View } from 'react-native';




export default function HomeScreen() {
  const { loading, error, user } = useAppSelector((state) => state.auth);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đây là trang chủ {user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    color: 'blue',
    marginBottom: 20,
  },
});
