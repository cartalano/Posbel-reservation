import { defineStore } from 'pinia';
import DateCustomerService from "@/services/DateCustomerService.js";

export const useDateCustomerStore = defineStore("reservation", {
    state: () => ({
        currentStep: "1",
        selectedDate: null,
        numberOfPeople: 0,
        tableType: "OUTDOOR",
        availableSlots: [],
        selectedSlot: null,
        isDialogVisible: false,
        reservationData: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        },
        organization: {
            name: "",
            email: "",
            phoneNumber: "",
            address: ""
        },
        hours: [],
        orgId: 1,
        disabledDates: [],
    }),

    actions: {
        resetForm() {
            this.currentStep = null;

            setTimeout(() => {
                this.currentStep = "1";
            }, 10);

            this.selectedDate = null;
            this.numberOfPeople = 1;
            this.availableSlots = [];
            this.selectedSlot = null;
            this.reservationData = {
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
            };

            window.scrollTo({ top: 0, behavior: "smooth" });
        },

        selectSlot(time) {
            this.selectedSlot = time;
        },

        getClosedDays() {
            const closedDays = this.hours
                .filter(day => day.isClosed)
                .map(day => day.day.toLowerCase()); // Stocke les jours fermés en minuscule

            const today = new Date();
            const disabledDates = [];

            for (let i = 0; i < 30; i++) { // Vérifie les 30 prochains jours
                const date = new Date(today);
                date.setDate(today.getDate() + i); // Ajoute les jours successifs
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase();

                if (closedDays.includes(dayName)) {
                    disabledDates.push(new Date(date)); // Ajoute l'objet Date
                }
            }
            return disabledDates;
        },

        async fetchOrganizationInfo() {
            try {
                const response = await DateCustomerService.fetchOrganization(this.orgId);
                if (response.data.status === "success" && response.data.data) {
                    this.organization = {
                        name: response.data.data.name,
                        email: response.data.data.email,
                        phoneNumber: response.data.data.phoneNumber,
                        address: response.data.data.address
                    };
                    this.hours = response.data.data.hours || [];
                    this.disabledDates = this.getClosedDays();


                } else {
                    console.error("Erreur API Organisation :", response.data.message);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des informations de l'organisation :", error);
            }
        },

        async fetchAvailableSlots() {
            if (!this.selectedDate) return;

            const date = new Date(this.selectedDate);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

            try {
                const response = await DateCustomerService.fetchAvailableSlots(formattedDate, this.numberOfPeople, this.orgId);
                if (response.data.status === "success") {
                    this.allTables = response.data.data;


                    const uniqueSlots = new Set();
                    this.allTables.forEach(table => {
                        table.availableStartTimes.forEach(time => {
                            uniqueSlots.add(time);
                        });
                    });


                    this.availableSlots = Array.from(uniqueSlots).sort();
                } else {
                    console.error("Erreur API :", response.data.message);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des créneaux :", error);
            }
        },

        async confirmReservation() {
            if (!this.reservationData.firstName || !this.reservationData.email || !this.selectedSlot) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            const date = new Date(this.selectedDate);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

            const selectedTable = this.allTables?.find(table => table.availableStartTimes.includes(this.selectedSlot));

            if (!selectedTable) {
                alert("Aucune table disponible pour ce créneau.");
                return;
            }

            const payload = {
                ...this.reservationData,
                numberOfAdults: this.numberOfPeople,
                numberOfBaby: 0,
                numberOfChildren: 0,
                organizationId: this.orgId,
                reservationDate: formattedDate,
                reservationStatus: "PENDING",
                reservationTime: this.selectedSlot,
                tableId: selectedTable.tableId.toString()
            };

            try {
                const response = await DateCustomerService.confirmReservation(payload);
                if (response.data.status === "success") {
                    this.isDialogVisible = true;

                    // Supprimer le créneau réservé de la liste
                    this.availableSlots = this.availableSlots.filter(slot => slot !== this.selectedSlot);

                    this.resetForm();
                } else {
                    alert("Erreur lors de la réservation.");
                }
            } catch (error) {
                console.error("Erreur lors de la réservation :", error);
            }
        },
    }
});
