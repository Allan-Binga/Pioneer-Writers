import axios from "axios";
import { endpoint } from "../server";
import { notify } from "./toast";

export async function fetchBids(orderId = null) {
  try {
    const url = orderId
      ? `${endpoint}/bids/order/${orderId}`
      : `${endpoint}/bids/all-bids`;

    const response = await axios.get(url, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Please login";
    notify.info(errorMessage);
    throw new Error(errorMessage);
  }
}
