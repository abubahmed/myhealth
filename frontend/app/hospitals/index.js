import { View, ScrollView, SafeAreaView, Text, TouchableOpacity, ToastAndroid, TextInput } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import axios from "axios";
import styles from "../../styles/styles";
import states from "../../util/states";

const Hospitals = () => {
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [hospitals, setHospitals] = useState([]);

    const attemptGetHospitals = async () => {
        if (state === "") {
            ToastAndroid.show("Please enter a valid state", ToastAndroid.SHORT);
            return;
        }
        try {
            const lowerCaseState = state.toLowerCase().trim();
            if (!states[lowerCaseState]) {
                return;
            }
            const response = await axios.post(
                "http://localhost:5000/others/hospitals",
                {
                    state: states[lowerCaseState],
                    zipCode: zipCode,
                },
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const data = response.data.data;
            setHospitals(data);
            if (data.length > 0) {
                ToastAndroid.show("Successfully retrieved hospitals", ToastAndroid.SHORT);
                setState("");
                setZipCode("");
            } else {
                ToastAndroid.show("No hospitals found", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log(error);
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
                <TextInput placeholder="State" value={state} onChangeText={setState} style={styles.defaultInput} />
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
