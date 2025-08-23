import axios from "axios";
import { endpoint } from "../server";
import { notify } from "./toast";

export async function fetchProfile() {
  try {
    const response = await axios.get(`${endpoint}/profile/client/my-profile`, {
      withCredentials: true, // Include cookies for authentication
    });
    return response.data; // Assuming response.data contains { user_id, username, email, ... }
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Please login.";
    notify.info(errorMessage);
    throw new Error(errorMessage);
  }
}
