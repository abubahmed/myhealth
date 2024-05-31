import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import styles from "../../styles/styles";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import checkTokenExpiration from "../../util/checkToken";
import { useRouter } from "expo-router";
import { PUBLIC_BACKEND_URL, LOCAL_BACKEND_URL } from "@env";

const Appointments = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [appointmentDesc, setAppointmentDesc] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [timeSet, setTimeSet] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl =
    PUBLIC_BACKEND_URL || LOCAL_BACKEND_URL || "http://localhost:5000";
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

  const attemptGetAppointments = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const tokenValid = await checkTokenExpiration();
      if (!tokenValid) {
        setLoading(false);
        router.replace("/");
      }
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.get(`${backendUrl}/appointments/get`, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });
      const appointments = response.data.data;
      setLoading(false);
      setAppointments(appointments);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error fetching appointments", ToastAndroid.SHORT);
      setLoading(false);
    }
  };

  const attemptAddAppointment = async ({ username, description, date, doctor }) => {
    if (loading) return;
    setLoading(true);
    if (!description || !date || !doctor || !username) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
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
      const response = await axios.post(
        `${backendUrl}/appointments/add`,
        {
          doctor: doctor,
          description: description,
          date: date,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const message = response.data.message;
      ToastAndroid.show(message, ToastAndroid.SHORT);
      setLoading(false);
      if (message === "Appointment successfully created") {
        attemptGetAppointments(username);
        setAppointmentDesc("");
        setAppointmentDate("");
        setDoctor("");
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error saving appointment", ToastAndroid.SHORT);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserAndAppointments = async () => {
      const username = await SecureStore.getItemAsync("username");
      setUsername(username);
      attemptGetAppointments(username);
    };
    getUserAndAppointments();
  }, []);

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: appointmentDate,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate;
        setAppointmentDate(currentDate);
        setTimeSet(true);
      },
      mode: currentMode,
      is24Hour: true,
    });
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
          placeholder="Description"
          style={styles.defaultInput}
          value={appointmentDesc}
          onChangeText={setAppointmentDesc}
        />
        <Pressable
          onPress={() => {
            showMode("time");
            showMode("date");
          }}>
          <View pointerEvents="none">
            <TextInput
              placeholder="Date (MM/DD/YYYY HH:MM:SS)"
              value={
                timeSet && appointmentDate
                  ? appointmentDate.toLocaleDateString() +
                    " " +
                    appointmentDate.toLocaleTimeString()
                  : ""
              }
              editable={false}
              style={[
                styles.defaultInput,
                {
                  marginVertical: 12,
                },
              ]}
            />
          </View>
        </Pressable>
        <TextInput
          placeholder="Doctor"
          value={doctor}
          onChangeText={setDoctor}
          style={[
            styles.defaultInput,
            {
              marginBottom: 12,
            },
          ]}
        />
        <TouchableOpacity
          style={styles.defaultBtn}
          onPress={() => {
            attemptAddAppointment({
              username: username,
              description: appointmentDesc,
              date: new Date(appointmentDate),
              doctor: doctor,
            });
          }}>
          <Text
            style={{
              fontSize: 18,
            }}>
            Save Appointment
          </Text>
        </TouchableOpacity>
        <View style={styles.appointmentsContainer}>
          <ScrollView>
            {appointments &&
              appointments.map((appointment, index) => {
                const appDate = new Date(appointment.date);
                return (
                  <View key={index} style={styles.appointmentContainer}>
                    <Text style={{ fontSize: 18 }}>{appointment.description}</Text>
                    <Text style={{ fontSize: 16 }}>{appointment.doctor}</Text>
                    <Text style={{ fontSize: 16 }}>
                      {appDate.toLocaleDateString() + " " + appDate.toLocaleTimeString()}
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

export default Appointments;
