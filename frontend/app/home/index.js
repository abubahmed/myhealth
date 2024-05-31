import { View, ScrollView, SafeAreaView, Text, Dimensions, ToastAndroid } from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import styles from "../../styles/styles";
import HomeButton from "../../components/HomeButton";
import checkTokenExpiration from "../../util/checkToken";
import { useRouter } from "expo-router";
const screenHeight = Dimensions.get("window").height;

const Home = () => {
  const router = useRouter();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [type, setType] = useState("");
  const [otherPerson, setOtherPerson] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const tokenValid = await checkTokenExpiration();
      if (!tokenValid) {
        router.replace("/");
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    const getTypeAndWelcome = async () => {
      const type = await SecureStore.getItemAsync("type");
      const username = await SecureStore.getItemAsync("username");
      setType(type);
      setOtherPerson(type === "patient" ? "Doctor" : "Patient");
      setWelcomeMessage(`Welcome, ${username}`);
    };
    getTypeAndWelcome();
    ToastAndroid.show("Successfully logged in", ToastAndroid.SHORT);
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
        }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 35,
            marginTop: screenHeight * 0.1,
          }}>
          {welcomeMessage}
        </Text>
        <View style={{ flexDirection: "row", marginTop: screenHeight * 0.1 }}>
          {type === "patient" && <HomeButton text="Find a Hospital" route="/hospitals" />}
          <HomeButton text={"Chat with your " + otherPerson} route="/messages" />
        </View>
        {type === "patient" && (
          <View View style={{ flexDirection: "row" }}>
            <HomeButton text="Recieve AI Health Evaluation" route="/ai-evaluation" />
            <HomeButton text="Manage appointments" route="/appointments" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
