import { decode } from "base-64"
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
global.atob = decode;

const checkTokenExpiration = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      console.log("No token found");
      SecureStore.deleteItemAsync("token");
      return false;
    }
    console.log(token);
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    const currentTime = Date.now().valueOf() / 1000;
    if (decodedToken.exp < currentTime) {
      console.log("Token expired");
      SecureStore.deleteItemAsync("token");
      return false;
    } else {
      console.log("Token valid");
      return true;
    }
  } catch (error) {
    console.log("Error: " + error);
    return false;
  }
};

export default checkTokenExpiration;
