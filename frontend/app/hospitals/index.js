import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/styles";
import states from "../../util/states";
import checkTokenExpiration from "../../util/checkToken";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { PUBLIC_BACKEND_URL, LOCAL_BACKEND_URL } from "@env";

const Hospitals = () => {
  const router = useRouter();
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = PUBLIC_BACKEND_URL || LOCAL_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const checkToken = async () => {
      const tokenValid = await checkTokenExpiration();
      if (!tokenValid) {
        setLoading(false);
        router.replace("/");
      }
    };
    checkToken();
  }, []);

  const attemptGetHospitals = async () => {
    if (loading) return;
    setLoading(true);
    if (state === "") {
      ToastAndroid.show("Please enter a valid state", ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    try {
      const tokenValid = await checkTokenExpiration();
      if (!tokenValid) {
        setLoading(false);
        router.replace("/");
      }
      const token = await SecureStore.getItemAsync("token");
      const lowerCaseState = state.toLowerCase().trim();
      if (!states[lowerCaseState]) {
        ToastAndroid.show("Please enter a valid state", ToastAndroid.SHORT);
        setLoading(false);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/hospitals`,
        {
          state: states[lowerCaseState],
          zipCode: zipCode,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      setHospitals(data);
      if (data.length > 0) {
        ToastAndroid.show("Successfully retrieved hospitals", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("No hospitals found", ToastAndroid.SHORT);
      }
      setState("");
      setZipCode("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error retrieving hospitals", ToastAndroid.SHORT);
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          placeholder="State"
          value={state}
          onChangeText={setState}
          style={styles.defaultInput}
        />
        <TextInput
          placeholder="Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          style={[
            styles.defaultInput,
            {
              marginVertical: 12,
            },
          ]}
        />
        <TouchableOpacity style={styles.defaultBtn} onPress={attemptGetHospitals}>
          <Text
            style={{
              fontSize: 18,
            }}>
            Search for Hospitals
          </Text>
        </TouchableOpacity>
        <View style={[styles.hospitalContainer]}>
          <ScrollView>
            {hospitals.map((hospital, index) => {
              return (
                <View key={index} style={styles.resultContainer}>
                  <Text style={{ fontSize: 18 }}>{hospital.name}</Text>
                  <Text style={{ fontSize: 16 }}>{hospital.street_address}</Text>
                  <Text style={{ fontSize: 16 }}>
                    {hospital.zip_code} {hospital.city}, {hospital.state}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Hospitals;
