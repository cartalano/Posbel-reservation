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
        <span class="h5 fw-bold"><i class="fas fa-user fs-3"></i> GESTION DES UTILISATEURS</span>
      </div>

      <!-- Boutons d'action -->
      <div class="table-actions">
        <Button icon="pi pi-plus" label="Créer" class="p-button-rounded ms-2" @click="openUserModal(null)"/>
      </div>

      <!-- Tableau des utilisateurs -->
      <div class="table-container">
        <DataTable :value="users" stripedRows removableSort class="no-border-table">
          <Column field="userId" header="ID" sortable></Column>
          <Column field="username" header="USERNAME" sortable></Column>
          <Column field="email" header="EMAIL" sortable></Column>
          <Column field="firstName" header="PRÉNOM" sortable></Column>
          <Column field="lastName" header="NOM" sortable></Column>
          <Column field="role" header="ROLE" sortable></Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="btn btn-warning me-2" @click="openUserModal(slotProps.data)" />
              <Button icon="pi pi-trash" class="btn btn-danger" @click="confirmDelete(slotProps.data.userId)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <!-- Modal Ajouter/Modifier Utilisateur -->
  <Dialog v-model:visible="showAddUserDialog" modal :header="isEditing ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'"
          :style="{ width: '30rem' }" class="p-3 border rounded shadow-lg bg-white custom-dialog" :closable="false">
    <template #header>
      <div class="d-flex justify-content-between align-items-center w-100">
        <span class="fw-bold text-dark fs-5">{{ isEditing ? 'Modifier un Utilisateur' : 'Ajouter un Utilisateur' }}</span>
        <Button icon="pi pi-times" class="btn btn-danger" @click="closeModal"/>
      </div>
    </template>

    <div class="p-fluid">
      <div class="mb-3">
        <label class="form-label fw-bold">Nom d'utilisateur</label>
        <input type="text" v-model="newUser.username" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Prénom</label>
        <input type="text" v-model="newUser.firstName" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Nom</label>
        <input type="text" v-model="newUser.lastName" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Email</label>
        <input type="email" v-model="newUser.email" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Mot de passe</label>
        <input type="password" v-model="newUser.passwordHash" class="form-control"/>
      </div>

      <!-- Boutons -->
      <div class="d-flex justify-content-between mt-3">
        <Button label="Annuler" class="p-button-text" @click="closeModal" />
        <Button label="Enregistrer" icon="pi pi-check" class="p-button-primary" @click="saveUser" />
      </div>
    </div>
  </Dialog>
</template>

<script>
import { useUserStore } from "@/store/UserStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

export default {
  name: "Users",
  components: { DataTable, Column, Button, Dialog },
  data() {
    return {
      store: useUserStore(),
      showAddUserDialog: false,
    };
  },
  computed: {
    users() {
      return this.store.formattedUsers;
    },
    newUser() {
      return this.store.newUser;
    },
    isEditing() {
      return this.store.isEditing;
    }
  },
  methods: {
    fetchUsers() {
      this.store.fetchUsers();
    },
    openUserModal(user) {
      this.store.openUserModal(user);
      this.showAddUserDialog = true;
    },
    saveUser() {
      this.store.saveUser();
      this.closeModal();
    },
    confirmDelete(userId) {
      this.store.deleteUser(userId);
    },
    closeModal() {
      this.showAddUserDialog = false;
      this.store.resetNewUser();
    }
  },
  mounted() {
    this.fetchUsers();
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

.nav-link {
  padding-top: 15px;
  padding-bottom: 15px;
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

/* Header */
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
  justify-content: end;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 50px;
}

/* Tableau */
.table-container {
  width: 100%;
  max-width: 70rem;
  background: transparent;
  border-radius: 1rem;
  overflow: hidden;
}

/* Alignement du texte */
:deep(.p-datatable .p-datatable-tbody td) {
  border-bottom: none !important;
  text-align: center !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th .p-datatable-column-header-content) {
  display: block !important;
  text-align: center !important;
}
</style>
