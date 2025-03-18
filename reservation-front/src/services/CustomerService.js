import ApiClient from './ApiClient';

export default {
    getCustomers() {
        return ApiClient.get('/customers/byOrganization/1');
    },

    addCustomer(customerData) {
        return ApiClient.post('/customers', customerData);
    },

    updateCustomer(customerId, customerData) {
        return ApiClient.put("/customers", { ...customerData, customerId});
    },

    deleteCustomer(customerId) {
        return ApiClient.delete(`/customers/${customerId}`);
    },
};
