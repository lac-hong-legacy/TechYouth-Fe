import { Dimensions, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface Appbuttonprops {
    title: string
    onPress: () => void;
    type?: "earthgold" | "secondary" | "gray"
    style?: ViewStyle;
    textStyle?: TextStyle;
    weight?: "400" | "600"  // thêm prop fontWeight
}

export default function AppButton({
    title,
    onPress,
    type = "earthgold",
    style,
    textStyle,
    weight = "600",
}: Appbuttonprops) {
    return (
        <TouchableOpacity style={[styles.base, type === "earthgold" ? styles.earthgold : type === "gray" ? styles.gray : styles.secondary, style,]} onPress={onPress}>
            <Text
                style={[
                    styles.text,
                    type === "earthgold" ? styles.textPrimary : type === "gray" ? styles.textGray : styles.textSecondary, { fontWeight: weight },
                    textStyle,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    base: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: "center",
        width: Dimensions.get("window").width - 40,
    },
    earthgold: {
        backgroundColor: "#C49B2E",
    },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#C49B2E",
    },
    text: {
        fontSize: 12,
        flexShrink: 1,       // chữ co lại nếu dài
        textAlign: "center",
    },
    textPrimary: {
        color: "#fff",
    },
    textSecondary: {
        color: "#C49B2E",
    },
    gray: {
        backgroundColor: "#d6d5d5ff", // màu mới
    },
    textGray: {
        color: "#000", // chữ đen
    },
});