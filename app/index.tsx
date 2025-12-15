import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <Pressable
          style={styles.listItem}
          onPress={() => router.push("/spike1")}
        >
          <Text style={styles.listItemTitle}>Spike 1</Text>
          <Text style={styles.listItemDescription}>WebView - Ghost Admin</Text>
        </Pressable>

        <Pressable
          style={styles.listItem}
          onPress={() => router.push("/spike2")}
        >
          <Text style={styles.listItemTitle}>Spike 2</Text>
          <Text style={styles.listItemDescription}>Native Components</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 14,
    color: "#666",
  },
});
