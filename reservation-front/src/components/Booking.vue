<template>
  <div class="app-container">
    <nav class="navbar-container">
      <ul class="nav flex-column navbar-menu">
        <li class="nav-item logo-container">
          <a href="home">
            <img src="@/assets/posbelLogo.svg" alt="Logo" class="logo-img">
          </a>
        </li>
        <li class="nav-item"><a href="home" class="nav-link text-white"><i class="fas fa-home fa-fw fs-3"></i></a></li>
        <li class="nav-item"><a href="booking" class="nav-link text-white"><i class="fas fa-calendar-alt fa-fw fs-3"></i></a></li>
        <li class="nav-item"><a href="tables" class="nav-link text-white"><i class="fas fa-table fa-fw fs-3"></i></a></li>
        <li class="nav-item"><a href="customers" class="nav-link text-white"><i class="fas fa-users fa-fw fs-3"></i></a></li>
        <li class="nav-item"><a href="users" class="nav-link text-white"><i class="fas fa-user fa-fw fs-3"></i></a></li>
        <li class="nav-item navbar-logout">
          <a href="org" class="nav-link text-white"><i class="fas fa-cog fa-fw fs-3"></i></a>
          <a href="login" class="nav-link text-white text-danger" @click="logout">
            <i class="fas fa-fw fa-sign-out-alt fs-3"></i>
          </a>
        </li>
      </ul>
    </nav>

    <div class="content-container">

      <div class="table-header">
        <span class="h5 fw-bold"><i class="fas fa-calendar-alt fs-3"></i> RÉSERVATIONS</span>
      </div>

      <div class="table-actions">
        <Button icon="pi pi-plus" label="Créer" class="p-button-rounded ms-2" @click="openAddReservationModal"/>
      </div>

      <div class="table-container">
        <DataTable :value="reservations" stripedRows removableSort class="no-border-table">
          <Column field="reservationId" sortable header="ID" ></Column>
          <Column field="formattedDate" sortable header="Date"></Column>
          <Column field="formattedTime" sortable header="Heure"></Column>
          <Column field="totalGuests" sortable header="Total Invités"></Column>
          <Column field="customerName" header="Client" sortable></Column>
          <Column field="comment" header="Commentaire"></Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="pi pi-trash" class="btn btn-danger" @click="deleteReservation(slotProps.data.reservationId)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <!-- Modal Ajout Réservation -->
  <Dialog v-model:visible="showAddReservationModal" modal header="Nouvelle Réservation">
  <div class="p-fluid">
      <div class="mb-3">
        <label class="form-label fw-bold">Nombre de personnes</label>
        <input type="number" v-model="newReservation.numberOfAdults" min="1" class="form-control" @change="fetchAvailableSlots" />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Date</label>
        <DatePicker v-model="newReservation.reservationDate" dateFormat="yy-mm-dd" @update:modelValue="fetchAvailableSlots" class="w-100" />
      </div>

      <!-- Créneaux horaires disponibles -->
      <div v-if="availableSlots && availableSlots.length > 0" class="mt-4">
        <h5 class="mb-3">Créneaux disponibles :</h5>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <div v-for="table in availableSlots" :key="table.tableId">
            <h6 class="text-primary">Table {{ table.tableId }} ({{ table.type }})</h6>
            <div class="d-flex flex-wrap justify-content-center gap-2">
              <span v-for="time in table.availableStartTimes"
                  :key="time"
                  class="creneau"
                  :class="{ 'selected': newReservation.reservationTime === time && newReservation.tableId === table.tableId }"
                  @click="selectSlot(time, table)">  {{ time }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Prénom</label>
        <input type="text" v-model="newReservation.firstName" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Nom</label>
        <input type="text" v-model="newReservation.lastName" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Email</label>
        <input type="email" v-model="newReservation.email" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Téléphone</label>
        <input type="text" v-model="newReservation.phoneNumber" class="form-control" />
      </div>
    </div>

    <template #footer>
      <Button label="Annuler" class="p-button-text" @click="showAddReservationModal = false" />
      <Button label="Ajouter" class="p-button-primary" @click="addReservation" />
    </template>
  </Dialog>
</template>

<script>
import { useBookingStore } from "@/store/BookingStore";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from "primevue/dialog";
import DatePicker from "primevue/datepicker";

export default {
  components: { DataTable, Column, Button, Dialog, DatePicker },
  data() {
    return {
      store: useBookingStore(),
      showAddReservationModal: false,
    };
  },
  computed: {
    reservations() {
      return this.store.formattedReservations;
    },
    newReservation() {
      return this.store.newReservation;
    },
    availableSlots() {
      return this.store.availableSlots;
    }
  },
  methods: {
    fetchReservations() {
      this.store.fetchReservations();
    },
    fetchAvailableSlots() {
      this.store.fetchAvailableSlots();
    },
    addReservation() {
      this.store.addReservation();
    },
    deleteReservation(reservationId) {
      this.store.deleteReservation(reservationId);
    },
    openAddReservationModal() {
      this.store.resetNewReservation();
      this.showAddReservationModal = true;
    },
    selectSlot(time, table) {
      this.store.newReservation.reservationTime = time;
      this.store.newReservation.tableId = table.tableId;
    }
  },
  mounted() {
    this.fetchReservations();
  }
};
</script>


<style scoped>

:root body {
  font-family: 'Arial', sans-serif;
  background-color: #161922;
  color: white;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #161922;
  padding: 20px;
}


.navbar-container {
  width: 70px;
  background-color: #1b1e2b;
  display: flex;
  align-items: start;
  justify-content: center;
  border-radius: 10px;
}


.content-container {
  font-family: "DM Sans", sans-serif;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  margin-top: 50px;
}


.table-header {
  width: 100%; /* S'assurer qu'il occupe toute la largeur */
  max-width: 70rem; /* Même largeur que le tableau */
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}


.table-actions {
  width: 100%;
  max-width: 70rem;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  margin-top: 10px;
}


.table-container {
  width: 100%;
  max-width: 70rem;
  background: transparent;
  border-radius: 1rem;
  overflow: hidden;
}



.p-datatable .p-datatable-tbody tr:nth-child(even) {
  background-color: #242730 !important; /* Gris foncé */
}


:deep(.p-datatable .p-datatable-tbody td) {
  border-bottom: none !important;
  text-align: center !important;
}
:deep(.p-datatable .p-datatable-thead > tr > th .p-datatable-column-header-content) {
  display: block !important;
  text-align: center !important;
}

.nav-link {
  padding-top: 15px;
  padding-bottom: 15px;
}

.selected {
  background-color: #28a745 !important; /* Couleur verte */
  color: white !important;
  border-radius: 8px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #218838;
  transition: background-color 0.3s ease;
}

.selected:hover {
  background-color: #218838 !important;
}


.logo-container{
  width: 100px;
  height: 100px;
  padding: 5px;
}
.logo-img {
  border-radius: 8px;
  width: 60%; /* Ajuste la taille selon ton besoin */
  height: 60%;
  display: block;
  object-fit: contain;
  margin: 0 auto;
}

.navbar-menu {
  display: flex;
  flex-direction: column;
  height: 90vh; /* Ajuste la hauteur de la navbar */
  align-items: center;
  padding: 10px 0;
}

.navbar-logout {
  margin-top: auto; /* Pousse uniquement le logout en bas */
}


</style>