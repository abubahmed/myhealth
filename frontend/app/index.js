import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  TextInput,
  BackHandler,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import styles from "../styles/styles";
import { PUBLIC_BACKEND_URL, LOCAL_BACKEND_URL } from '@env'

const Welcome = () => {
  const router = useRouter();
  const [firstState, setFirstState] = useState(true);
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("patient");

  const backendUrl =
    PUBLIC_BACKEND_URL || LOCAL_BACKEND_URL || "http://localhost:5000";
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!firstState) {
        setFirstState(true);
        setLoginState(false);
        setSignupState(false);
        setLoginUsername("");
        setLoginPassword("");
        setSignupUsername("");
        setSignupPassword("");
        setReenterPassword("");
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [firstState]);

  const attemptSignup = async () => {
    if (loading) return;
    setLoading(true);
    if (signupPassword !== reenterPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/users/add`,
        {
          username: signupUsername,
          password: signupPassword,
          type: type,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = response.data;
      if (data.message === "Signup successful") {
        setFirstState(true);
        setSignupState(false);
        save("username", signupUsername);
        save("password", signupPassword);
        save("type", type);
        setSignupPassword("");
        setSignupUsername("");
        setReenterPassword("");
        setLoginPassword("");
        setLoginUsername("");
        setType("patient");
        save("token", data.token);
        setLoading(false);
        router.push("/home");
      } else {
        ToastAndroid.show("Signup unsuccessful", ToastAndroid.SHORT);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const attemptLogin = async () => {
    console.log(backendUrl)
    console.log(loading)
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/users/login`,
        {
          username: loginUsername,
          password: loginPassword,
          type: type,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = response.data;
      if (data.message === "Login successful") {
        setFirstState(true);
        setLoginState(false);
        save("username", loginUsername);
        save("password", loginPassword);
        save("type", type);
        setLoginPassword("");
        setLoginUsername("");
        setSignupPassword("");
        setSignupUsername("");
        setReenterPassword("");
        setType("patient");
        save("token", data.token);
        setLoading(false);
        router.push("/home");
      } else {
        ToastAndroid.show("Login unsuccessful", ToastAndroid.SHORT);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("../assets/images/logo.png")}
          resizeMode="cover"
          style={styles.logoImage}
        />
        <View style={styles.welcomeBtnsContainer}>
          {firstState && (
            <>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <TouchableOpacity
                  style={[
                    styles.welcomeOptionBtn,
                    {
                      backgroundColor:
                        type === "doctor" ? "rgb(200, 200, 200)" : "rgb(255, 255, 255)",
                      borderWidth: type === "doctor" ? 0 : 2,
                    },
                  ]}
                  onPress={() => {
                    setType("doctor");
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    Doctor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.welcomeOptionBtn,
                    {
                      backgroundColor:
                        type === "patient" ? "rgb(200, 200, 200)" : "rgb(255, 255, 255)",
                      borderWidth: type === "patient" ? 0 : 2,
                    },
                  ]}
                  onPress={() => {
                    setType("patient");
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    Patient
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setFirstState(false);
                  setLoginState(true);
                }}
                style={[styles.loginSignupBtn]}>
                <Text
                  style={{
                    fontSize: 20,
                  }}>
                  Log in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFirstState(false);
                  setSignupState(true);
                }}
                style={[styles.loginSignupBtn, { marginTop: 12 }]}>
                <Text
                  style={{
                    fontSize: 20,
                  }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </>
          )}
          {loginState && (
            <>
              <TextInput
                placeholder="Username"
                value={loginUsername}
                onChangeText={setLoginUsername}
                style={styles.welcomeInput}
              />
              <TextInput
                placeholder="Password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                style={styles.welcomeInput}
                secureTextEntry={true}
              />
              <TouchableOpacity
                onPress={attemptLogin}
                style={[styles.loginSignupBtn, styles.loginSignupBtnSmall, { marginTop: 12 }]}>
                <Text
                  style={{
                    fontSize: 20,
                  }}>
                  Log in
                </Text>
              </TouchableOpacity>
            </>
          )}
          {signupState && (
            <>
              <TextInput
                placeholder="Username"
                value={signupUsername}
                onChangeText={setSignupUsername}
                style={styles.welcomeInput}
              />
              <TextInput
                placeholder="Password"
                value={signupPassword}
                onChangeText={setSignupPassword}
                style={styles.welcomeInput}
                secureTextEntry={true}
              />
              <TextInput
                placeholder="Re-enter Password"
                value={reenterPassword}
                onChangeText={setReenterPassword}
                style={styles.welcomeInput}
                secureTextEntry={true}
              />
              <TouchableOpacity
                onPress={attemptSignup}
                style={[styles.loginSignupBtn, styles.loginSignupBtnSmall, { marginTop: 12 }]}>
                <Text
                  style={{
                    fontSize: 20,
                  }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
