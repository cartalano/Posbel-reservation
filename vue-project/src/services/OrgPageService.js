import ApiClient from "@/services/ApiClient.js";

export default {
    fetchOrganization() {
        return ApiClient.get("/org/1");
    },

    updateOrganization(updatedData) {
        return ApiClient.put("/org/1", updatedData);
    }
};
