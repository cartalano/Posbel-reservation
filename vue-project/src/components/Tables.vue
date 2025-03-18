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
        <span class="h5 fw-bold"><i class="fas fa-table fs-3"></i> GESTION DES TABLES</span>
      </div>

      <!-- Sélecteur de date -->
      <div class="table-actions">
        <div class="date-picker-container">
          <label class="fw-bold">Sélectionner une date :</label>
          <DatePicker v-model="selectedDate"
                      dateFormat="yy-mm-dd"
                      @update:modelValue="updateDate"
                      class="w-100 border rounded shadow-sm p-2 bg-white" />
        </div>
        <Button icon="pi pi-plus" label="Créer" class="p-button-rounded ms-2" @click="openAddDialog"/>
      </div>

      <!-- Tableau des tables -->
      <div class="table-container">
        <DataTable :value="tables" stripedRows removableSort class="no-border-table">
          <Column field="tablesId" header="ID" sortable></Column>
          <Column field="name" header="Nom" sortable></Column>
          <Column field="seatingCapacity" header="Capacité" sortable></Column>
          <Column field="location" header="Salle" sortable></Column>
          <Column field="isAvailable" header="Disponible en ligne" sortable>
            <template #body="slotProps">
              <span :class="slotProps.data.isAvailable ? 'text-success fw-bold' : 'text-danger fw-bold'">
                {{ slotProps.data.isAvailable ? 'Oui' : 'Non' }}
              </span>
            </template>
          </Column>
          <!-- Créneaux horaires disponibles -->
          <Column header="Créneaux dispo">
            <template #body="slotProps">
              <Select
                  v-model="selectedSlot[slotProps.data.tablesId]"
                  :options="getAvailableSlots(slotProps.data.tablesId)"
                  optionLabel="time"
                  placeholder="Sélectionnez un créneau"
                  class="w-full md:w-56"
                  editable
                  @focus="fetchAvailableSlotsForTable(slotProps.data.tablesId, slotProps.data.seatingCapacity)"
              />
            </template>
          </Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="btn btn-warning me-2" @click="openEditDialog(slotProps.data)" />
              <Button icon="pi pi-trash" class="btn btn-danger" @click="deleteTable(slotProps.data.tablesId)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>


  <!-- Modal pour ajouter une nouvelle table -->
  <Dialog v-model:visible="showAddDialog" modal  :style="{ width: '30rem' }"
          class="p-3 border rounded shadow-lg bg-white custom-dialog" :closable="false">
    <template #header>
      <div class="d-flex justify-content-between align-items-center w-100">
        <span class="fw-bold text-dark fs-5">Modifier une Table</span>
        <Button icon="pi pi-times" class="btn btn-danger"
                @click="showAddDialog = false"/>
      </div>
      </template>
    <div class="p-fluid">
      <!-- Sélection de la salle -->
      <div class="mb-3">
        <label for="location" class="form-label fw-bold">Salle</label>
        <select id="location" v-model="newTable.location" class="form-select">
          <option value="TERRACE">Terrasse</option>
          <option value="INDOOR">Intérieur</option>
          <option value="OUTDOOR">Extérieur</option>
        </select>
      </div>

      <!-- Sélection de la capacité -->
      <div class="mb-3">
        <label for="seatingCapacity" class="form-label fw-bold">Capacité</label>
        <input type="number" id="seatingCapacity" v-model="newTable.seatingCapacity" class="form-control" min="1" />
      </div>

      <!-- Boutons -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <button type="button" class="btn btn-secondary" @click="showAddDialog = false">Annuler</button>
        <button type="button" class="btn btn-primary" @click="addTable">Ajouter</button>
      </div>
    </div>
  </Dialog>
  <!-- Modal pour modifier une table -->
  <Dialog v-model:visible="showEditDialog" modal :closable="false" :style="{ width: '30rem' }"
          class="p-3 border rounded shadow-lg bg-white custom-dialog">
    <template #header>
      <div class="d-flex justify-content-between align-items-center w-100">
        <span class="fw-bold text-dark fs-5">Modifier une Table</span>
        <Button icon="pi pi-times" class="btn btn-danger"
                @click="showEditDialog = false"/>
      </div>
    </template>

    <div class="p-fluid">
      <!-- Modifier le Nom -->
      <div class="mb-3">
        <label for="name" class="form-label fw-bold">Nom</label>
        <input type="text" id="name" v-model="tableToEdit.name" class="form-control"/>
      </div>

      <!-- Sélection de la salle -->
      <div class="mb-3">
        <label for="location" class="form-label fw-bold">Salle</label>
        <select id="location" v-model="tableToEdit.location" class="form-select">
          <option value="TERRACE">Terrasse</option>
          <option value="INDOOR">Intérieur</option>
          <option value="OUTDOOR">Extérieur</option>
        </select>
      </div>

      <!-- Modifier la capacité -->
      <div class="mb-3">
        <label for="seatingCapacity" class="form-label fw-bold">Capacité</label>
        <input type="number" id="seatingCapacity" v-model="tableToEdit.seatingCapacity"
               class="form-control" min="1" />
      </div>

      <!-- Disponible en ligne -->
      <div class="mb-3">
        <label class="form-label fw-bold">Disponible en ligne</label>
        <select v-model="tableToEdit.isAvailable" class="form-select">
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
      </div>

      <!-- Boutons -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <button type="button" class="btn btn-secondary" @click="showEditDialog = false">Annuler</button>
        <button type="button" class="btn btn-primary" @click="updateTable">Modifier</button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { useTableStore } from "@/store/TablesStore.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";

export default {
  name: "Tables",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    Select,
    DatePicker
  },
  data() {
    return {
      store: useTableStore(),
      selectedSlot: {},
    };
  },
  computed: {
    tables() {
      return this.store.formattedTables;
    },
    newTable() {
      return this.store.newTable;
    },
    selectedDate() {
      return this.store.selectedDate;
    },
    tableToEdit() {
      return this.store.tableToEdit;
    },
    showAddDialog: {
      get() {
        return this.store.showAddDialog;
      },
      set(value) {
        this.store.showAddDialog = value;
      }
    },
    showEditDialog: {
      get() {
        return this.store.showEditDialog;
      },
      set(value) {
        this.store.showEditDialog = value;
      }
    }
  },
  methods: {
    fetchTables() {
      this.store.fetchTables();
    },
    addTable() {
      this.store.addTable();
    },
    deleteTable(tableId) {
      this.store.deleteTable(tableId);
    },
    fetchAvailableSlotsForTable(tableId, seatingCapacity) {
      this.store.fetchAvailableSlotsForTable(tableId, seatingCapacity);
    },
    getAvailableSlots(tableId) {
      return this.store.availableSlots[tableId]?.map(time => ({ time })) || [];
    },
    openAddDialog() {
      this.store.openAddDialog();
    },
    updateDate(newDate) {
      this.store.setSelectedDate(newDate);
    },
    openEditDialog(table) {
      console.log(" Ouverture de la modification pour :", table);
      this.store.openEditDialog(table);
    },
    updateTable() {
      console.log(" Mise à jour de la table :", this.store.tableToEdit);
      this.store.updateTable();
    }
  },
  mounted() {
    this.fetchTables();
  },
};
</script>


<style scoped>

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #161922;
  padding: 20px;
}

/*  Barre latérale */
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

/*  Contenu principal */
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

/*  Header du tableau */
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

.table-actions {
  width: 100%;
  max-width: 70rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 50px;
}

.date-picker-container {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.date-picker-container label {
  color: white;
  font-weight: bold;
  margin-bottom: 5px;
}


.table-container {
  width: 100%;
  max-width: 70rem;
  background: transparent;
  border-radius: 1rem;
  overflow: hidden;
}


.p-datatable .p-datatable-tbody tr:nth-child(even) {
  background-color: #242730 !important;
}

/*  Alignement du texte dans les colonnes */
:deep(.p-datatable .p-datatable-tbody td) {
  border-bottom: none !important;
  text-align: center !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th .p-datatable-column-header-content) {
  display: block !important;
  text-align: center !important;
}

.btn {
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.navbar-logout {
  margin-top: auto;
}

/*  Ajuster les labels */
.form-label {
  font-weight: bold;
  color: #333;
}

/*  Ajuster la taille des inputs et boutons */
.form-control, .form-select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
}

/*  Correction des boutons */
.d-flex .btn {
  min-width: 12px;
  padding: 10px;
  font-weight: bold;
}

:deep(.p-datepicker) {
  border: none !important; /* Supprime la bordure du calendrier */
  background-color: transparent !important; /* Rend le fond transparent */
  box-shadow: none !important; /* Supprime l'ombre */
}

:deep(.p-inputtext) {
  background-color: #1e1f2f !important; /* Change la couleur de fond */
  border: none !important; /* Supprime la bordure */
  color: #878787 !important; /* Change la couleur du texte */
  padding: 10px;
  border-radius: 8px; /* Ajoute un arrondi */
}

.p-select {
  background-color: #1e1f2f !important; /* Change la couleur de fond */
  border: none !important; /* Supprime la bordure */
  color: white !important; /* Change la couleur du texte */
}

</style>