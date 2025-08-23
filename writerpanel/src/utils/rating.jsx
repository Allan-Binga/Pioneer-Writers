import axios from "axios";
import { backend } from "../backend";
import { notify } from "./toast";

export async function fetchRatings(writerId) {
  try {
    const response = await axios.get(
      `${backend}/ratings/writer/get-ratings/${writerId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "Failed to fetch ratings.";
    notify.info(errorMessage);
    throw new Error(errorMessage);
  }
}
