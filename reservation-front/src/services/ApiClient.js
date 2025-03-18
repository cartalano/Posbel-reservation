import axios from "axios";

// Détecte si l'application tourne en local ou sur un autre appareil
const BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:8090/api"  // Utilisé si Vue.js tourne sur le même Mac que le backend
    : "http://192.168.1.3:8090/api"; // Utilisé si Vue.js est accédé depuis un autre appareil sur le réseau

const ApiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token automatiquement si présent
ApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default ApiClient;
