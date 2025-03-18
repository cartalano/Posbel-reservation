import ApiClient from "@/services/ApiClient.js";

export default {

    fetchTables() {
        return ApiClient.get("/fetch");
    },

    addTable(tableData) {
        return ApiClient.post("/table", tableData);
    },

    deleteTable(tableId) {
        return ApiClient.delete(`/table/${tableId}`);
    },

    fetchAvailableSlots(formattedDate, numberOfPeople) {
        return ApiClient.get(`/table-slots/available?date=${formattedDate}&numberOfPeople=${numberOfPeople}&orgId=1`);
    },

    updateTable(tableData) {
        return ApiClient.put(`/table`, tableData);
    }
};