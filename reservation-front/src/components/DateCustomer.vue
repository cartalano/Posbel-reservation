<template>
  <div class="background"></div>
  <div class="reservation-header">
    <img src="@/assets/posbelLogo.svg" alt="Logo" class="logo-img">
    <h3 class="reservation-title">
      Réservation
      <br> {{ store.organization.name }}
    </h3>
  </div>

  <div class="reservation-page">
    <div class="reservation-container d-flex justify-content-center align-items-start">
      <!-- Colonne gauche : Stepper -->
      <div class="reservation-stepper">
        <div class="card mx-auto p-4">
          <Stepper :value="store.currentStep" class="w-100">
            <StepList>
              <Step value="1">Couverts</Step>
              <Step value="2">Date</Step>
              <Step value="3">Heures</Step>
              <Step value="4">Validation</Step>
            </StepList>

            <StepPanels>
              <!-- Étape 1 : Sélection -->
              <StepPanel v-slot="{ activateCallback }" value="1">
                <div class="text-center">
                  <h5 class="mb-3">Combien de personnes ?</h5>
                  <div class="d-flex align-items-center justify-content-center number-picker">
                    <button class="btn-circle" @click="decreasePeople" :disabled="store.numberOfPeople <= 1">−</button>
                    <span class="number-display mx-3">{{ store.numberOfPeople }}</span>
                    <button class="btn-circle" @click="increasePeople">+</button>
                  </div>
                </div>
                <p v-if="store.numberOfPeople > 0" class="text-couvert text-center mt-5 ">
                 Voulez-vous {{ store.numberOfPeople }} couvert{{ store.numberOfPeople > 1 ? 's' : '' }} ?
                </p>
                <div class="d-flex pt-2 justify-content-end">
                  <Button label="Suivant" icon="pi pi-arrow-right" @click="activateCallback('2')"/>
                </div>
              </StepPanel>

              <!-- Étape 2 : Choix de la Date -->
              <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="text-center">
                  <h5 class="mb-3">Choisissez une date</h5>
                  <DatePicker v-model="store.selectedDate" inline :disabledDates="store.disabledDates"  @update:modelValue="store.fetchAvailableSlots"
                              class="w-100 border rounded shadow-sm p-3 bg-white"/>
                </div>
                <div class="d-flex pt-4 justify-content-between">
                  <Button label="Retour" icon="pi pi-arrow-left" @click="activateCallback('1')"/>
                  <Button label="Suivant" icon="pi pi-arrow-right" :disabled="!store.selectedDate" @click="activateCallback('3')"/>
                </div>
              </StepPanel>

              <!-- Étape 3 : Choix des créneaux horaires -->
              <StepPanel v-slot="{ activateCallback }" value="3">
                <div class="text-center">
                  <h5 class="mb-3">Choisissez un créneau horaire</h5>
                  <div v-if="store.availableSlots.length > 0">
                    <div class="d-flex flex-wrap justify-content-center gap-3">
                    <span v-for="time in store.availableSlots" :key="time"
                          class="creneau"
                          :class="{ 'selected': store.selectedSlot === time }"
                          @click="store.selectSlot(time)">
                      {{ time }}
                    </span>
                    </div>
                  </div>
                </div>
                <div class="d-flex pt-4 justify-content-between">
                  <Button label="Retour" icon="pi pi-arrow-left" @click="activateCallback('2')"/>
                  <Button label="Suivant" icon="pi pi-arrow-right" :disabled="!store.selectedSlot" @click="activateCallback('4')"/>
                </div>
              </StepPanel>

              <!-- Étape 4 : Validation -->
              <StepPanel v-slot="{ activateCallback }" value="4">
                <div class="text-center">
                  <h5 class="mb-3">Finalisez votre réservation</h5>
                  <input type="text" v-model="store.reservationData.firstName" placeholder="Prénom" class="form-control mb-3"/>
                  <input type="text" v-model="store.reservationData.lastName" placeholder="Nom" class="form-control mb-3"/>
                  <input type="email" v-model="store.reservationData.email" placeholder="Email" class="form-control mb-3"/>
                  <input type="text" v-model="store.reservationData.phoneNumber" placeholder="Téléphone" class="form-control mb-3"/>
                  <button class="btn btn-dark mt-3" @click="store.confirmReservation">Confirmer</button>
                </div>
                <div class="pt-4">
                  <Button label="Retour" icon="pi pi-arrow-left" @click="activateCallback('3')"/>
                </div>
              </StepPanel>

            </StepPanels>
          </Stepper>
        </div>
      </div>

    <!-- Colonne droite : Informations établissement -->
    <div class="reservation-info">
      <div class="card p-3 pb-0">
        <table  class="table table-sm table-striped custom-striped text-center">
          <tbody>
          <tr v-for="day in store.hours" :key="day.day">
            <td class="fw-bold">{{ day.day }}</td>
            <td v-if="day.isClosed" colspan="2" class="text-dark">Fermé</td>
            <template v-else>
              <td>{{ getTimeSlot(day.hours, 0)  }}</td>
              <td>{{ getTimeSlot(day.hours, 1)   }}</td>
            </template>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="card p-3 mt-3 organization-card">
        <h5 class="text-center mb-2">{{ store.organization.name }}</h5>
        <ul class=" ">
          <li class="list-group-item pt-2"><i class="fa fa-envelope me-1"></i> {{ store.organization.email }}</li>
          <li class="list-group-item pt-2"><i class="fa fa-phone me-1"></i> {{ store.organization.phoneNumber }}</li>
          <li class="list-group-item pt-2"><i class="fa fa-map-marker me-1"></i> {{ store.organization.address }}</li>
        </ul>
      </div>
      <Dialog v-model:visible="store.isDialogVisible" modal header="Merci pour votre réservation " class="confirmation-dialog">
        <div class="text-center">
          <h4>A bientôt ! </h4>
          <Button label="OK" icon="pi pi-check" class="mt-3" @click="closeDialog" />
        </div>
      </Dialog>
    </div>
  </div>
  </div>
</template>



<script>

import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import Step from "primevue/step";
import StepPanels from "primevue/steppanels";
import StepPanel from "primevue/steppanel";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { useDateCustomerStore} from "@/store/DateCustomerStore.js";

export default {
  name: "ReservationStepper",
  components: {
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    DatePicker,
    Button,
    Dialog,
  },
  data() {
    return {
      store: useDateCustomerStore() };
  },
  methods: {
    getTimeSlot(hours, index) {
      return hours[index] ? `${hours[index].start} - ${hours[index].end}` : "";
    },
    increasePeople() {
      this.store.numberOfPeople++;
    },
    decreasePeople() {
      if (this.store.numberOfPeople > 1) {
        this.store.numberOfPeople--;
      }
    },
    closeDialog() {
      this.store.isDialogVisible = false;
      this.store.resetForm(); // Réinitialise le formulaire après la fermeture du dialog
    }

  },
  mounted() {
    this.store.fetchOrganizationInfo();
  }
};
</script>


<style scoped>
:root {
  --font-primary: "DM Sans", sans-serif;
}

* {
  font-family: var(--font-primary) !important;
}

i, .fa, .pi {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Pro", "FontAwesome", "PrimeIcons" !important;
  font-weight: 900; /* Nécessaire pour certaines icônes */
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: #161821;
  clip-path: ellipse(92% 80% at 90% 120%);
}

.reservation-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin-left: 4rem; /* Décale vers la droite si besoin */
  margin-top: 3rem;
}

.logo-img {
  width: 65px;
  height: auto;
  border-radius: 8px;
}

.reservation-title {
  margin-top: 7px;
  font-size: 1.5rem;
  font-family: "DM Sans", sans-serif;
  font-weight: bold;
  color: #333;
}

.reservation-page {
  width: 100vw;
  min-height: 65vh; /* Prend toute la hauteur de l'écran */
  display: flex;
  align-items: center;
}

.reservation-container {
  display: flex;
  gap: 2rem; /* Espacement entre le Stepper et les infos */
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

.reservation-stepper {
  flex: 1; /* La colonne prend la place disponible */
  max-width: 600px; /* Ajuste la largeur du Stepper */
  font-size: 0.9rem;
}

.reservation-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
}

.card {
  width: 100%;
  font-family: "DM Sans", sans-serif;
}

/* Centrer le texte dans le tableau */
.table {
  font-size: 0.8rem;
  width: 100%;
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
}

.table th,
.table td {
  padding: 8px;
}

.table th {
  font-weight: bold;
}

.creneau {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  font-weight: bold;
  margin: 5px;
}

.creneau:hover {
  background-color: #8393F3;
  color: white;
}

.selected {
  background-color: #6275D9 !important;
  color: white !important;
  border-color: #6275D9;
}

.table-striped tbody tr td {
  border: none !important;
}

.table-striped tbody tr:nth-of-type(even) td {
  background-color: #fdfdfd !important;
  color: #000000 !important;
}

.text-couvert {
  font-size: 1rem;
  font-family: "DM Sans", sans-serif;
  font-weight: revert;
  color: #6c757d;
}
.text-primary {
  color: black !important;
}

.organization-card {
  background-color: #fdfdfd;
  color: #000000;
  border-radius: 8px;
}

.organization-card h5 {
  font-size: 1.3rem;
  color: #000000;
  padding-bottom: 8px;
}

.organization-card .list-group-item {
  background-color: transparent !important; /* Supprime le fond des items */
  border: none !important;
  color: #000000;
  font-family: "DM Sans", sans-serif;
  font-size: 0.8rem;
}

.btn-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid black;
  background-color: white;
  color: black;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-circle:hover {
  background-color: #6275D9;
  border: white;
  color: white;
}

.btn-circle:disabled {
  opacity: 0.5;
}

.number-display {
  font-size: 1.5rem;
  font-weight: normal;
  color: black;
  min-width: 30px;
  text-align: center;
}

.confirmation-dialog {
  width: 350px;
}

.confirmation-dialog h4 {
  color: #6275D9;
  font-weight: bold;
}

.confirmation-dialog p {
  color: #333;
  font-size: 1rem;
}

.confirmation-dialog .p-button {
  background-color: #6275D9;
  border: none;
}



@media (max-width: 768px) {
  .reservation-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 10px;
  }

  .reservation-stepper, .reservation-info {
    max-width: 100%;
    width: 100%;
  }

  .reservation-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-left: 0;
    margin-top: 1rem;
  }

  .logo-img {
    width: 50px;
    margin-bottom: 0.5rem;
  }

  .reservation-title {
    font-size: 1.2rem;
    margin-top: 0;
  }

  .card {
    padding: 1rem;
  }


  .btn-circle {
    width: 30px;
    height: 30px;
    font-size: 1.1rem;
  }

  .number-display {
    font-size: 1.2rem;
  }
}

</style>