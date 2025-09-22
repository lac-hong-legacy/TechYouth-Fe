// components/BackButton.tsx
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type BackButtonProps = {
  label?: string;        // text hiển thị
  to?: string;           // screen cần điều hướng
};

export default function BackButton({ label = "", to }: BackButtonProps) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => to ? navigation.navigate(to) : navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={24} color="#000000ff" />
      <Text style={styles.backText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    color: "#000000ff",
    fontSize: 16,
    fontWeight: "500",
  },
});
