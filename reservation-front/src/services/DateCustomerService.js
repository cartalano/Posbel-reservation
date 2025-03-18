import ApiClient from "@/services/ApiClient.js";

export default {

    fetchAvailableSlots(formattedDate, numberOfPeople) {
        return ApiClient.get(`/table-slots/available?date=${formattedDate}&numberOfPeople=${numberOfPeople}&orgId=1`);
    },

    confirmReservation(payload) {
        return ApiClient.post("/reservation/save", payload);
    },

    fetchOrganization() {
        return ApiClient.get(`/fetch`);
    }
};
