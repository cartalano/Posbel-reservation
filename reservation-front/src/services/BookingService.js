import ApiClient from "@/services/ApiClient.js";

export default {
    fetchReservations() {
        return ApiClient.get("/fetch");
    },

    addReservation(reservationData) {
        return ApiClient.post("/reservation/save", reservationData);
    },

    deleteReservation(reservationId) {
        return ApiClient.delete(`/reservation/${reservationId}`);
    },

    fetchAvailableSlots(reservationDate, numberOfAdults) {
        return ApiClient.get(`/table-slots/available?date=${reservationDate}&numberOfPeople=${numberOfAdults}&orgId=1`);
    }
};