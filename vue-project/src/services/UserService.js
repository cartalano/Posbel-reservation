import ApiClient from './ApiClient.js';

export default {
    getUsers() {
        return ApiClient.get('/user/byOrgId/1');
    },

    addUser(userData) {
        return ApiClient.post('/user/addUser', userData);
    },

    updateUser(userId, userData) {
        return ApiClient.put(`/user`, { ...userData, userId});
    },

    deleteUser(userId) {
        return ApiClient.delete(`/user/${userId}`);
    }
}