import { StyleSheet, View, Text } from "react-native";


export default function rating() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đây là bản xếp hạng của tôi</Text>
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
    }
})