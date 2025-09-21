import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProfilrScreen({ navigation }: any) {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đây là profile của tôi</Text>

            <Button title="Login" onPress={() => navigation.navigate('Login')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        borderColor: 'red',
        color: 'green',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
    }
})