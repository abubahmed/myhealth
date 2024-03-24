import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const HomeButton = ({ text, route }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.outerHomeBtn}
            onPress={() => {
                router.push(route);
            }}>
            <View style={styles.innerHomeBtn}>
                <Text style={styles.homeBtnText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    outerHomeBtn: {
        borderWidth: 5,
        borderColor: "rgb(200, 200, 200)",
        borderRadius: 500,
    },
    innerHomeBtn: {
        width: screenWidth * 0.45,
        height: screenWidth * 0.45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 500,
        borderWidth: 5,
        borderColor: "rgb(100, 100, 100)",
    },
    homeBtnText: {
        fontSize: 20,
        width: screenWidth * 0.35,
        textAlign: "center",
    },
});

export default HomeButton;
