import ApiClient from "@/services/ApiClient.js";

export default {
    getDashboardData() {
        return ApiClient.get("/fetch");
    }
};
