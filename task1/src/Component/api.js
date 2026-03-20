// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend
});

export const getProducts = () => API.get("/products");
export const getCategories = () => API.get("/categories");

export default API;