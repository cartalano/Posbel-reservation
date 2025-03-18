import { defineStore } from "pinia";
import OrgPageService from "@/services/OrgPageService.js";

export const useOrgPageStore = defineStore("orgPage", {
    state: () => ({
        organization: null,
        isEditing: false,
        editedData: {}
    }),

    actions: {
        async fetchOrganization() {
            try {
                const response = await OrgPageService.fetchOrganization();
                if (response.data.status === "success" && response.data.data) {
                    this.organization = response.data.data;
                } else {
                    console.error("Erreur API Organisation :", response.data.message);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des informations de l'organisation :", error);
            }
        },

        startEditing() {
            this.isEditing = true;
            this.editedData = { ...this.organization };
        },

        cancelEditing() {
            this.isEditing = false;
            this.editedData = {};
        },

        async updateOrganization() {
            try {
                if (!this.organization) {
                    console.error(" Erreur : aucune organisation sélectionnée.");
                    return;
                }

                const updatedData = {
                    ...this.editedData,
                    organizationId: this.organization.organizationId,
                    posbelId: this.organization.posbelId,
                };

                console.log(" Données envoyées pour modification :", updatedData);

                const response = await OrgPageService.updateOrganization(updatedData);
                if (response.data.status === "success") {
                    alert(" Organisation mise à jour avec succès !");
                    this.isEditing = false;
                    await this.fetchOrganization();
                } else {
                    alert(" Erreur lors de la mise à jour de l'organisation.");
                }
            } catch (error) {
                console.error(" Erreur lors de la mise à jour de l'organisation :", error);
            }
        }
    }
});
