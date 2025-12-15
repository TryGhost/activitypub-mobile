import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function Spike1() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://apdevstaging.ghost.is/ghost/" }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
