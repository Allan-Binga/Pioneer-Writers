import axios from "axios";
import { endpoint } from "../server";
import { notify } from "./toast";

export async function fetchProfile() {
  try {
    const response = await axios.get(`${endpoint}/profile/my-profile`, {
      withCredentials: true, // Include cookies for authentication
    });
    return response.data; // Assuming response.data contains { user_id, username, email, ... }
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Failed to fetch profile";
    notify.error(errorMessage);
    throw new Error(errorMessage);
  }
}
