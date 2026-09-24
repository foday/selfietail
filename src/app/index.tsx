import { StatusBar } from "expo-status-bar";
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// const heroImage = require("../../assets/images/auth-demo-pets.png");
const heroImage = require("../../design/Selfietail_reedited.jpg");

export default function Index() {
  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <ImageBackground source={heroImage} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage} >
        <View style={styles.photoShade} />
        {/* <View style={styles.coralGlow} /> */}
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.content}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>Where pets and people</Text>
              <Text style={styles.title}>share their stories</Text>
            </View>
            <View style={styles.actions}>
              <SignInButton icon={<GoogleMark />} label="Sign in with Google" />
              <SignInButton icon={<Text style={styles.apple}></Text>} label="Sign in with Apple" />
              <View style={styles.orRow}><View style={styles.rule} /><Text style={styles.or}>or</Text><View style={styles.rule} /></View>
              <TextInput placeholder="Username, email, phone #" placeholderTextColor="#8B9398" style={styles.input} autoCapitalize="none" />
              <Pressable><Text style={styles.account}>Have an account?</Text></Pressable>
            </View>
          </View>
          <Text style={styles.sparkle}>✦</Text>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

function SignInButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <Pressable style={styles.button}><View style={styles.icon}>{icon}</View><Text style={styles.buttonText}>{label}</Text></Pressable>;
}

function GoogleMark() { return <Text style={styles.google}>G</Text>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f87a5d" },
  hero: { flex: 1, backgroundColor: "#f87a5d", overflow: "hidden" },
  heroImage: { width: "100%", height: "100%", opacity: 0.98, transform: [{ scale: 1.035 }] },
  photoShade: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(78, 31, 14, 0.08)" },
  coralGlow: { position: "absolute", top: "49%", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(247, 106, 75, 0.62)" },
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 30, paddingBottom: 36 },
  titleWrap: { position: "absolute", left: 0, right: 0, bottom: 285, alignItems: "center" },
  title: { color: "white", fontSize: 22, lineHeight: 29, letterSpacing: -0.7, fontWeight: "800", textAlign: "center", textShadowColor: "rgba(78,27,17,0.38)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 },
  actions: { gap: 7 },
  button: { height: 44, backgroundColor: "#fff", borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row", shadowColor: "#7d3c2b", shadowOpacity: 0.48, shadowRadius: 3, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  icon: { width: 30, alignItems: "center", justifyContent: "center" },
  google: { fontSize: 25, fontWeight: "800", color: "#4285F4", fontFamily: "Arial" },
  apple: { color: "#000", fontSize: 24 },
  buttonText: { color: "#050505", fontSize: 17, lineHeight: 22, fontWeight: "700", marginLeft: 1 },
  orRow: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 4, marginBottom: 4 },
  rule: { height: 1.5, flex: 1, backgroundColor: "rgba(255, 220, 200, 0.48)" },
  or: { color: "#ffe0d0", fontSize: 17, fontWeight: "400" },
  input: { height: 50, borderRadius: 6, borderWidth: 1, borderColor: "#d3d9dc", backgroundColor: "rgba(252, 255, 255, 0.95)", paddingHorizontal: 12, color: "#24272a", fontSize: 16, textAlign: "center" },
  account: { color: "#fff", fontSize: 15, fontWeight: "600", textAlign: "center", marginTop: 13, textShadowColor: "rgba(91, 38, 24, 0.35)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  sparkle: { position: "absolute", right: 27, bottom: 22, color: "#ffe3d5", fontSize: 46, lineHeight: 46 },
});
