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
        <span class="h5 fw-bold"><i class="fas fa-users fs-3"></i> GESTION DES CLIENTS</span>
      </div>

      <!-- Actions -->
      <div class="table-actions">
        <Button icon="pi pi-plus" label="Créer" class="p-button-rounded ms-2" @click="openCustomerModal()"/>
      </div>

      <!-- Tableau des clients -->
      <div class="table-container">
        <DataTable :value="customers" scrollable scroll-height="60vh" stripedRows removableSort class="no-border-table">
          <Column field="customerId" header="ID" sortable></Column>
          <Column field="fullName" header="Nom" sortable></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="phoneNumber" header="Téléphone" sortable></Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="btn btn-warning me-2" @click="openCustomerModal(slotProps.data)" />
              <Button icon="pi pi-trash" class="btn btn-danger" @click="confirmDelete(slotProps.data.customerId)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <!-- Modal Ajouter/Modifier Client -->
  <Dialog v-model:visible="showAddDialog" modal :header="isEditing ? 'Modifier le Client' : 'Ajouter un Client'"
          :style="{ width: '30rem' }" class="p-3 border rounded shadow-lg bg-white custom-dialog" :closable="false">
    <template #header>
      <div class="d-flex justify-content-between align-items-center w-100">
        <span class="fw-bold text-dark fs-5">{{ isEditing ? 'Modifier un client' : 'Ajouter un client' }}</span>
        <Button icon="pi pi-times" class="btn btn-danger" @click="closeModal"/>
      </div>
    </template>

    <div class="p-fluid">
      <div class="mb-3">
        <label class="form-label fw-bold">Prénom</label>
        <input type="text" v-model="newCustomer.firstName" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Nom</label>
        <input type="text" v-model="newCustomer.lastName" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Email</label>
        <input type="email" v-model="newCustomer.email" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Téléphone</label>
        <input type="text" v-model="newCustomer.phoneNumber" class="form-control"/>
      </div>

      <!-- Boutons -->
      <div class="d-flex justify-content-between mt-3">
        <Button label="Annuler" class="p-button-text" @click="closeModal" />
        <Button label="Enregistrer" icon="pi pi-check" class="p-button-primary" @click="saveCustomer" />
      </div>
    </div>
  </Dialog>
</template>
<script>
import { useCustomerStore } from "@/store/CustomerStore";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
  name: "Customers",
  components: { DataTable, Column, Button, Dialog },
  data() {
    return {
      store: useCustomerStore(),
      showAddDialog: false,
    };
  },
  computed: {
    customers() {
      return this.store.formattedCustomers;
    },
    newCustomer() {
      return this.store.newCustomer;
    },
    isEditing() {
      return this.store.isEditing;
    },
  },
  methods: {
    fetchCustomers() {
      this.store.fetchCustomers();
    },
    openCustomerModal(customer = null) {
      this.store.openCustomerModal(customer);
      this.showAddDialog = true;
    },
    async saveCustomer() {
      await this.store.saveCustomer();
      this.closeModal();
    },
    closeModal() {
      this.showAddDialog = false;
      this.store.resetNewCustomer();
    },
    confirmDelete(customerId) {
      this.store.deleteCustomer(customerId);
    },
    exportToCSV() {
      if (this.customers.length === 0) {
        alert("Aucun client à exporter.");
        return;
      }
      let csvContent = "ID,Nom,Email,Téléphone\n";
      this.customers.forEach(customer => {
        const row = `${customer.customerId},"${customer.fullName}","${customer.email}","${customer.phoneNumber}"\n`;
        csvContent += row;
      });
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "liste_clients.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>


<style scoped>
/* Structure principale */
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
  max-height: 90vh;
}

.navbar-menu {
  display: flex;
  flex-direction: column;
  height: 85vh;
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

/* Header du tableau */
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

/* Actions */
.table-actions {
  width: 100%;
  max-width: 70rem;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

/* Tableau */
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

/* Alignement du texte dans les colonnes */
:deep(.p-datatable .p-datatable-tbody td) {
  border-bottom: none !important;
  text-align: center !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th .p-datatable-column-header-content) {
  display: block !important;
  text-align: center !important;
}

/* Boutons d'action */
.btn {
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.navbar-logout {
  margin-top: auto;
}
</style>
