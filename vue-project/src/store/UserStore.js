import { defineStore } from "pinia";
import UserService from "../services/UserService";


export const useUserStore = defineStore("user", {
    state: () => ({
        users: [],
        newUser: { username: "", firstName: "", lastName: "", email: "", passwordHash: "" },
        editingUserId: null,
    }),

    getters: {
        formattedUsers(state) {
            return state.users.map(user => ({
                userId: user.userId || "",
                username: user.username || "Inconnu",
                email: user.email || "Non renseigné",
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role || "Non attribué",
            })) || [];
        },
        isEditing(state) {
            return state.editingUserId !== null;
        }
    },

    actions: {
        async fetchUsers() {
            try {
                const response = await UserService.getUsers();
                if (response.data.status === "success") {
                    this.users = response.data.data;
                }
            } catch (error) {
                console.error("erreur lors de la récupération des utilisateurs :", error);
            }
        },
        async saveUser() {
            try {
                const userPayload = {
                    username: this.newUser.username,
                    firstName: this.newUser.firstName,
                    lastName: this.newUser.lastName,
                    email: this.newUser.email,
                    role: this.newUser.role,
                    organizationId: "1",
                };

                if (this.editingUserId) {
                    // Mode modification (Ne PAS inclure `passwordHash`)
                    userPayload.userId = this.editingUserId.toString();
                    console.log("📌 Modification d'un utilisateur :", JSON.stringify(userPayload, null, 2));
                    await UserService.updateUser(this.editingUserId, userPayload);
                } else {
                    // Mode ajout (Inclure `passwordHash`)
                    console.log("📌 Ajout d'un nouvel utilisateur :", JSON.stringify(userPayload, null, 2));
                    await UserService.addUser({ ...userPayload, passwordHash: this.newUser.passwordHash });
                }

                await this.fetchUsers();
                this.resetNewUser();
            } catch (error) {
                console.error("⚠️ Erreur lors de la sauvegarde de l'utilisateur :", error);
            }
        },

        async deleteUser(userId) {
            try {
                if (confirm("Are you sure you want to delete?")) {
                    await UserService.deleteUser(userId);
                    this.users = this.users.filter(c => c.userId !== userId);
                }
            } catch (error) {
                console.error("erreur lors de la suppression de l'utilisateur", error);
            }
        },

        openUserModal(user = null) {
            if (user) {
                this.editingUserId = user.userId;
                this.newUser = {
                    username: user.username || "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    role: user.role || "",
                };
            } else {
                this.resetNewUser();
            }
        },

        resetNewUser() {
            this.newUser = { username: "", firstName: "", lastName: "", email: "", passwordHash: "" };
            this.editingUserId = null;
        }
    },
});