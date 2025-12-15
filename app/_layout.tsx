import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Spikes",
        }}
      />
      <Stack.Screen
        name="spike1"
        options={{
          title: "Spike 1 - WebView",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="spike2"
        options={{
          title: "Spike 2 - Native",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
