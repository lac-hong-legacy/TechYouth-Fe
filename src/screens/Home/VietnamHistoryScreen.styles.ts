import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4ecd8" },
  dynastyContainer: { height: 100, marginBottom: 15 },
  dynastyButton: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center",
  },
  dynastyInfo: { marginTop: 8, alignItems: "center" },
  subEventName: { fontSize: 11, fontWeight: "600", color: "#4B5563" },
  subEventPeriod: { fontSize: 9, color: "#9CA3AF" },
  completedBadge: {
    position: "absolute", top: -4, right: -4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#23c65e",
    justifyContent: "center", alignItems: "center"
  },
  eraHeaderContainer: { flexDirection: "row", alignItems: "center", marginVertical: 20, justifyContent: "center" },
  eraDivider: { flex: 0.3, height: 1, backgroundColor: "#888" },
  eraHeader: { marginHorizontal: 10, fontWeight: "bold", color: "#444" }
});
