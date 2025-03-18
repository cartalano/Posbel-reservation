import { defineStore } from "pinia";
import LoginService from "@/services/LoginService.js";
import router from "@/router";

export const useLoginStore = defineStore("login", {
    state: () => ({
        token: localStorage.getItem("token") || null,
        isSubmitting: false,
        errorMessage: null,
    }),

    actions: {
        async login(loginData) {
            if (!loginData || !loginData.username || !loginData.password) {
                this.errorMessage = "Les identifiants sont invalides.";
                return;
            }

            console.log("methode activate");

            this.isSubmitting = true;
            this.errorMessage = null;

            try {
                console.log("envoi des données :", loginData);
                const response = await LoginService.login({
                    username: loginData.username,
                    password: loginData.password
                });

                console.log(response);

                if (response.data.status === "success") {
                    const data = response.data.data;
                    localStorage.setItem("token", data.token);
                    this.token = data.token; // Mise à jour du state
                    console.log("Token enregistré :", data.token);

                    await router.push({ path: "/booking" });
                } else {
                    this.errorMessage = "Échec de connexion. Vérifiez vos identifiants.";
                }
            } catch (error) {
                console.error("Erreur de connexion :", error);
                this.errorMessage = "Une erreur est survenue lors de la connexion.";
                localStorage.removeItem("token");
            } finally {
                this.isSubmitting = false;
            }
        },

        logout() {
            localStorage.removeItem("token");
            this.token = null;
            router.push("/login");
        }
    }
});
