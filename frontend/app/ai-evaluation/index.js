import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Image,
  TextInput,
} from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/styles";
import * as SecureStore from "expo-secure-store";
import checkTokenExpiration from "../../util/checkToken";
import { useRouter } from "expo-router";
const screenHeight = Dimensions.get("window").height;

const Evaluation = () => {
  const router = useRouter();
  const [symptomInput, setSymptomInput] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const checkToken = async () => {
      const tokenValid = await checkTokenExpiration();
      if (!tokenValid) {
        router.replace("/");
      }
    };
    checkToken();
  }, []);

  const attemptEvaluation = async () => {
    try {
      const tokenValid = await checkTokenExpiration();
      if (!tokenValid) {
        router.replace("/");
      }
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.post(
        "http://localhost:5000/others/evaluate",
        {
          prompt: symptoms,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      console.log(data);
      setEvaluation(data);
      ToastAndroid.show("Evaluation successfully completed", ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error completing evaluation", ToastAndroid.SHORT);
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <ScrollView
          style={styles.symptomsContainer}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}>
          {symptoms.length != 0 &&
            symptoms.map((symptom, index) => {
              return (
                <View key={index} style={styles.symptomContainer}>
                  <Text
                    key={index}
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                    }}>
                    {symptom}
                  </Text>
                </View>
              );
            })}
        </ScrollView>
        <View style={styles.symptomInputContainer}>
          <TextInput
            placeholder="Enter your symptom"
            value={symptomInput}
            onChangeText={setSymptomInput}
            style={[styles.defaultInput, {}]}
          />
          <TouchableOpacity
            onPress={() => {
              setSymptoms([...symptoms, symptomInput]);
              setSymptomInput("");
            }}>
            <Image
              source={require("../../assets/images/plus.png")}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.defaultBtn} onPress={attemptEvaluation}>
          <Text
            style={{
              fontSize: 18,
            }}>
            Recieve Evaluation
          </Text>
        </TouchableOpacity>
        <ScrollView
          style={[
            styles.hospitalContainer,
            {
              height: screenHeight * 0.35,
              padding: 15,
            },
          ]}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text
            style={{
              fontSize: 18,
            }}>
            {evaluation}
          </Text>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Evaluation;
