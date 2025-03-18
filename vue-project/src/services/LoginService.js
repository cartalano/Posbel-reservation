import ApiClient from "@/services/ApiClient.js";

export default {
    login(loginData) {
        return ApiClient.post("/user/login", loginData)
    }
};
