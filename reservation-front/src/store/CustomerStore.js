import { defineStore } from "pinia";
import CustomerService from "@/services/CustomerService.js";

export const useCustomerStore = defineStore("customer", {
    state: () => ({
        customers: [],
        newCustomer: { firstName: "", lastName: "", email: "", phoneNumber: "" },
        editingCustomerId: null,
    }),

    getters: {
        formattedCustomers(state) {
            return state.customers.map(customer => ({
                customerId: customer.customerId,
                fullName: `${customer.firstName} ${customer.lastName}`,
                email: customer.email || "Non renseigné",
                phoneNumber: customer.phoneNumber || "Non renseigné",
            }));
        },
        isEditing(state) {
            return state.editingCustomerId !== null;
        }
    },

    actions: {

        async fetchCustomers() {
            try {
                const response = await CustomerService.getCustomers();
                if (response.data.status === "success") {
                    this.customers = response.data.data;
                }
            } catch (error) {
                console.error(" Erreur lors de la récupération des clients:", error);
            }
        },

        //  Ajouter ou Modifier un client
        async saveCustomer() {
            try {
                const customerPayload = {
                    ...this.newCustomer,
                    organizationId: "1", // Organisation par défaut
                };

                if (this.editingCustomerId) {
                    // Mode modification
                    customerPayload.customerId = this.editingCustomerId.toString();
                    console.log(" Modification d'un client :", JSON.stringify(customerPayload, null, 2));
                    await CustomerService.updateCustomer(this.editingCustomerId, customerPayload);
                } else {
                    // Mode ajout
                    console.log(" Ajout d'un nouveau client :", JSON.stringify(customerPayload, null, 2));
                    await CustomerService.addCustomer(customerPayload);
                }

                await this.fetchCustomers();
                this.resetNewCustomer();
            } catch (error) {
                console.error("Erreur lors de la sauvegarde du client:", error);
            }
        },

        // Supprimer un client
        async deleteCustomer(customerId) {
            try {
                if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
                    await CustomerService.deleteCustomer(customerId);
                    this.customers = this.customers.filter(c => c.customerId !== customerId);
                }
            } catch (error) {
                console.error("Erreur lors de la suppression du client:", error);
            }
        },

        // Ouvrir le modal en mode "ajouter" ou "modifier"
        openCustomerModal(customer = null) {
            if (customer) {
                this.editingCustomerId = customer.customerId;
                const [firstName, lastName] = customer.fullName.split(" ");
                this.newCustomer = {
                    firstName: firstName || "",
                    lastName: lastName || "",
                    email: customer.email,
                    phoneNumber: customer.phoneNumber
                };
            } else {
                this.resetNewCustomer();
            }
        },

        //  Réinitialiser les données du formulaire
        resetNewCustomer() {
            this.newCustomer = { firstName: "", lastName: "", email: "", phoneNumber: "" };
            this.editingCustomerId = null;
        }
    },
});
