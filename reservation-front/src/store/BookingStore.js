import { defineStore } from "pinia";
import BookingService from "@/services/BookingService.js";

export const useBookingStore = defineStore("booking", {
    state: () => ({
        reservations: [],
        availableSlots: [],
        newReservation: {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            reservationDate: null,
            reservationTime: "",
            numberOfAdults: 1,
            numberOfChildren: 0,
            numberOfBaby: 0,
            tableId: null,
            organizationId: "1",
            reservationStatus: "PENDING",
        },
    }),

    getters: {
        formattedReservations(state) {
            return Array.isArray(state.reservations) ? state.reservations.map(reservation => {
                const customer = state.customers.find(c => c.customerId === reservation.customerId);

                return {
                    reservationId: reservation.reservationId,
                    customerId: reservation.customerId,
                    customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Inconnu",
                    tableId: reservation.tableId,
                    organizationId: reservation.organizationId,
                    formattedDate: reservation.reservationDate
                        ? new Date(reservation.reservationDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })
                        : "Non spécifié",
                    formattedTime: reservation.reservationTime
                        ? reservation.reservationTime.substring(0, 5)
                        : "Non spécifié",
                    totalGuests: (reservation.numberOfAdults || 0)
                        + (reservation.numberOfChildren || 0)
                        + (reservation.numberOfBaby || 0),
                    reservationStatus: reservation.reservationStatus || "UNKNOWN",
                    comment: reservation.comment || "No comment",
                };
            }) : [];
        },
    },

    actions: {
        async fetchReservations() {
            try {
                console.log("Token envoyé :", localStorage.getItem("token"));
                const response = await BookingService.fetchReservations();
                if (response.data.status === "success") {
                    this.reservations = response.data.data.reservations || [];
                    this.customers = response.data.data.customers || [];
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des réservations :", error);
            }
        },

        async fetchAvailableSlots() {
            try {
                if (!this.newReservation.reservationDate || !this.newReservation.numberOfAdults) return;

                const formattedDate = new Date(this.newReservation.reservationDate.getTime() - this.newReservation.reservationDate.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split("T")[0]

                const response = await BookingService.fetchAvailableSlots(formattedDate, this.newReservation.numberOfAdults);

                if (response.data.status === "success") {
                    this.availableSlots = response.data.data || [];
                } else {
                    console.error("Erreur API créneaux horaires :", response.data.message);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des créneaux disponibles :", error);
            }
        },

        async addReservation() {
            try {
                if (!this.newReservation.firstName || !this.newReservation.email || !this.newReservation.reservationTime || !this.newReservation.tableId) {
                    alert("Veuillez remplir tous les champs obligatoires.");
                    return;
                }

                const formattedDate = this.newReservation.reservationDate
                    ? new Date(this.newReservation.reservationDate.getTime() - this.newReservation.reservationDate.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0]
                    : null;


                const reservationPayload = {
                    email: this.newReservation.email,
                    firstName: this.newReservation.firstName,
                    lastName: this.newReservation.lastName,
                    phoneNumber: this.newReservation.phoneNumber,
                    reservationDate: formattedDate,
                    reservationTime: this.newReservation.reservationTime,
                    numberOfAdults: parseInt(this.newReservation.numberOfAdults, 10) || 1,
                    numberOfChildren: parseInt(this.newReservation.numberOfChildren, 10) || 0,
                    numberOfBaby: parseInt(this.newReservation.numberOfBaby, 10) || 0,
                    organizationId: this.newReservation.organizationId,
                    tableId: this.newReservation.tableId,
                    reservationStatus: "PENDING"
                };


                const response = await BookingService.addReservation(reservationPayload);

                if (response.data.status === "success") {
                    alert("Réservation confirmée !");
                    this.fetchReservations();
                    this.resetNewReservation();
                    return this.showAddReservationModal = false;
                } else {
                    alert("Erreur lors de la réservation.");
                    return false;
                }
            } catch (error) {
                console.error("Erreur lors de l'ajout de la réservation :", error);
                alert("Une erreur est survenue lors de l'ajout de la réservation.");
                return false;
            }
        },

        resetNewReservation() {
            this.newReservation = {
                email: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                reservationDate: null,
                reservationTime: "",
                numberOfAdults: 1,
                numberOfChildren: 0,
                numberOfBaby: 0,
                tableId: null,
                organizationId: "1",
                reservationStatus: "PENDING"
            };
            this.availableSlots = [];
        },
        async deleteReservation(reservationId) {
            try {
                if (confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
                    const response = await BookingService.deleteReservation(reservationId);

                    if (response.data.status === "success") {
                        alert("Réservation supprimée avec succès !");

                        this.reservations = this.reservations.filter(res => res.reservationId !== reservationId);
                    } else {
                        alert("Erreur lors de la suppression.");
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de la réservation :", error);
                alert("Une erreur est survenue lors de la suppression.");
            }
        }
    },

});
