<template>
  <div class="app-container">
    <!-- Barre latérale -->
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

    <!-- Contenu principal -->
    <div class="content-container">
      <div class="table-header">
        <span class="h5 fw-bold"><i class="fas fa-cog fs-3"></i> ORGANISATIONS</span>
      </div>

      <div class="card p-4 shadow-sm">
        <div class="row">
          <!-- Affichage en deux colonnes -->
          <div class="col-md-6 mb-3" v-for="item in organizationData" :key="item.key">
            <label class="form-label">{{ item.label }}</label>
            <input
                v-if="store.isEditing"
                v-model="store.editedData[item.key]"
                class="form-control edit-input"
            />
            <div v-else class="info-value">{{ item.value }}</div>
          </div>
        </div>

        <!-- Boutons Modifier / Enregistrer -->
        <div class="d-flex justify-content-end mt-4">
          <Button v-if="!store.isEditing" label="Modifier" icon="pi pi-pencil" class="btn btn-warning me-2" @click="store.startEditing"/>
          <Button v-if="store.isEditing" label="Annuler" icon="pi pi-times" class="btn btn-secondary me-2" @click="store.cancelEditing"/>
          <Button v-if="store.isEditing" label="Enregistrer" icon="pi pi-save" class="btn btn-primary" @click="store.updateOrganization"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useOrgPageStore} from "@/store/OrgPageStore.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

export default {
  name: "OrgPage",
  components: {
    DataTable,
    Column,
    Button,
  },
  data() {
    return {
      store: useOrgPageStore(),
    };
  },
  computed: {
    organizationData() {
      if (!this.store.organization) return [];
      return [
        {key: "name", label: "Nom", value: this.store.editedData.name || this.store.organization.name},
        {key: "email", label: "Email", value: this.store.editedData.email || this.store.organization.email},
        {key: "phoneNumber", label: "Téléphone", value: this.store.editedData.phoneNumber || this.store.organization.phoneNumber},
        {key: "address", label: "Adresse", value: this.store.editedData.address || this.store.organization.address},
        {key: "vatNumber", label: "Numéro TVA", value: this.store.editedData.vatNumber || this.store.organization.vatNumber},
        {key: "websiteUrl", label: "Site Web", value: this.store.editedData.websiteUrl || this.store.organization.websiteUrl},
        {key: "reservationInterval", label: "Intervalle Réservation (min)", value: this.store.editedData.reservationInterval || this.store.organization.reservationInterval},
        {key: "timeOfReservation", label: "Durée Réservation (min)", value: this.store.editedData.timeOfReservation || this.store.organization.timeOfReservation},
        {key: "lastBookingMargin", label: "Dernier Délai Réservation (min)", value: this.store.editedData.lastBookingMargin || this.store.organization.lastBookingMargin}
      ];
    }
  },
  mounted() {
    this.store.fetchOrganization();
  }
};
</script>

<style scoped>

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #161922;
  padding: 20px;
}

/* Barre latérale */
.navbar-container {
  width: 70px;
  background-color: #1b1e2b;
  display: flex;
  align-items: start;
  justify-content: center;
  border-radius: 10px;
}

.navbar-menu {
  display: flex;
  flex-direction: column;
  height: 90vh;
  align-items: center;
  padding: 10px 0;
}

.nav-link {
  padding-top: 15px;
  padding-bottom: 15px;
}

.navbar-logout {
  margin-top: auto;
}

.logo-container {
  width: 100px;
  height: 100px;
  padding: 5px;
}

.logo-img {
  border-radius: 8px;
  width: 60%;
  height: 60%;
  display: block;
  object-fit: contain;
  margin: 0 auto;
}

/* Contenu principal */
.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  margin-top: 50px;
  font-family: "DM Sans", sans-serif;
}

.table-header {
  width: 100%;
  max-width: 70rem;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}



/* Carte des informations */
.card {
  width: 100%;
  max-width: 900px;
  background-color: #1c2029;
  border-radius: 12px;
  color: white;
  padding: 20px;
  margin-top: 40px;
}

.form-label {
  font-weight: bold;
}

/* Inputs en mode édition */
.edit-input {
  background-color: #242730;
  border: 1px solid #3A3F4B;
  color: white;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
}

/* Affichage des valeurs */
.info-value {
  background-color: #242730;
  padding: 10px;
  border-radius: 8px;
  text-align: left;
  color: #a5a5a5;
}

/* Boutons */
.btn {
  border-radius: 8px;
  padding: 10px 20px;
}
</style>

