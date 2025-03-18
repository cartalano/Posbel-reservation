import { defineStore } from "pinia";
import DashboardService from "@/services/DashboardService.js";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        totalReservations: 0,
        totalGuests: 0,
        totalSlots: 0,
        occupiedSlots: 0,
        chartData: null,
    }),

    getters: {
        occupancyRate(state) {
            return state.totalSlots > 0 ? ((state.occupiedSlots / state.totalSlots) * 100).toFixed(2) : 0;
        }
    },


    actions: {
        async fetchDashboardStats() {

            try {
                const response = await DashboardService.getDashboardData();
                if (response.data.status === "success") {
                    const data = response.data.data;


                    const today = new Date().toISOString().split('T')[0];
                    console.log("date du jour:", today);


                    const todaysReservations = data.reservations.filter(res => res.reservationDate === today);


                    this.totalReservations = todaysReservations.length;

                    //  **Calculer le nombre total de personnes attendues**
                    this.totalGuests = todaysReservations.reduce((total, res) =>
                        total + res.numberOfAdults + res.numberOfChildren + res.numberOfBaby, 0
                    );

                    //  **Calcul du nombre total de créneaux disponibles**
                    this.totalSlots = data.tables.length * data.hours.length;

                    //  **Créneaux occupés (réservations du jour)**
                    this.occupiedSlots = todaysReservations.length;

                    this.updateChartData();
                }
            } catch (error) {
                console.error("Erreur lors du chargement des stats du dashboard :", error);
            }
        },
        updateChartData() {
            const documentStyle = getComputedStyle(document.body);
            const availableSlots = Math.max(0, this.totalSlots - this.occupiedSlots);

            this.chartData = {
                labels: ["Réservé", "Disponible"],
                datasets: [
                    {
                        data: [this.occupiedSlots, availableSlots],
                        backgroundColor: [
                            documentStyle.getPropertyValue("--p-orange-500"),
                            documentStyle.getPropertyValue("--p-gray-500"),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue("--p-orange-400"),
                            documentStyle.getPropertyValue("--p-gray-400"),
                        ],
                    },
                ],
            };
        }
    }
});
