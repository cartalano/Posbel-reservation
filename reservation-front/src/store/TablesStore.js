import { defineStore } from "pinia";
import TablesService from "@/services/TablesService.js";

export const useTableStore = defineStore("table", {
    state: () => ({
        tables: [],
        availableSlots: {},
        selectedDate: new Date().toISOString().split("T")[0],
        newTable: {
            location: "INDOOR",
            seatingCapacity: 4
        },
        tableToEdit: null,
        showAddDialog: false,
        showEditDialog: false,
    }),

    getters: {
        formattedTables(state) {
            return Array.isArray(state.tables) ? state.tables.map(table => ({
                tablesId: table.tableId,
                name: table.name,
                seatingCapacity: table.seatingCapacity,
                location: table.location,
                isAvailable: table.isAvailable
            })) : [];
        }
    },

    actions: {
        async fetchTables() {
            try {
                const response = await TablesService.fetchTables();
                if (response.data.status === "success" && response.data.data && response.data.data.tables) {
                    this.tables = response.data.data.tables || [];
                } else {
                    console.error("Erreur API : données tables non trouvées.");
                    this.tables = [];
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des tables :", error);
            }
        },

        async fetchAvailableSlotsForTable(tableId, seatingCapacity) {
            console.log(` Requête pour table ${tableId} avec capacité ${seatingCapacity}`);
            try {
                if (!tableId || !seatingCapacity) return;

                const date = this.selectedDate instanceof Date ? this.selectedDate : new Date(this.selectedDate);

                // Format YYYY-MM-DD (évite les problèmes de fuseau horaire)
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

                console.log(` Date envoyée : ${formattedDate}`);

                const response = await TablesService.fetchAvailableSlots(formattedDate, seatingCapacity);

                if (response.data.status === "success") {
                    const slots = response.data.data.find(slot => slot.tableId === tableId);
                    this.availableSlots = { ...this.availableSlots, [tableId]: slots?.availableStartTimes || [] };
                } else {
                    console.error("Erreur API créneaux horaires :", response.data.message);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des créneaux disponibles :", error);
            }
        },

        async addTable() {
            try {
                const payload = {
                    location: this.newTable.location,
                    organizationId: "1",  // Organisation ID fixe
                    seatingCapacity: Number(this.newTable.seatingCapacity)
                };

                const response = await TablesService.addTable(payload);
                if (response.data.status === "success") {
                    alert("Table ajoutée avec succès !");
                    this.fetchTables();
                    this.showAddDialog = false;
                } else {
                    alert("Erreur lors de l'ajout de la table.");
                }
            } catch (error) {
                console.error("Erreur lors de l'ajout de la table :", error);
            }
        },

        async deleteTable(tableId) {
            try {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette table ?")) {
                    const response = await TablesService.deleteTable(tableId);
                    if (response.data.status === "success") {
                        alert("Table supprimée avec succès !");
                        this.tables = this.tables.filter(table => table.tablesId !== tableId);
                        this.fetchTables()
                    } else {
                        alert("Erreur lors de la suppression.");
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de la table :", error);
            }
        },

        async updateTable() {
            try {
                if (!this.tableToEdit || !this.tableToEdit.tablesId) {
                    console.error("Erreur : Aucune table à modifier.");
                    return;
                }

                const payload = {
                    tableId: this.tableToEdit.tablesId,
                    name: this.tableToEdit.name,
                    location: this.tableToEdit.location,
                    isAvailable: String(this.tableToEdit.isAvailable),
                    seatingCapacity: Number(this.tableToEdit.seatingCapacity),
                    organizationId: "1",
                };

                console.log("Envoi des données à l'API :", payload);

                const response = await TablesService.updateTable(payload);

                if (response.data.status === "success") {
                    this.fetchTables();
                    this.showEditDialog = false;
                    this.tableToEdit = null;
                } else {
                    console.error("Erreur API :", response.data.message);
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la table :", error);
            }
        },

        openEditDialog(table) {
            this.tableToEdit = { ...table };
            this.showEditDialog = true;
        },

        setSelectedDate(date) {
            this.selectedDate = date;
            this.availableSlots = {}; // Réinitialise les créneaux horaires pour éviter d'afficher d'anciennes données
        },

        openAddDialog() {
            this.newTable = { location: "INDOOR", seatingCapacity: 4 };
            this.showAddDialog = true;
        }
    }
});
