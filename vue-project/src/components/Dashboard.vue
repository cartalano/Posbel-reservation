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
        <span class="h5 fw-bold"><i class="fas fa-home-alt fs-3"></i> DASHBOARD</span>
      </div>


      <div class="dashboard-grid">
        <!--  Nombre total de réservations du jour -->
        <div class="card stat-card resa" @click="goToBooking">
          <h5><i class="pi pi-calendar"></i> Réservations du jour</h5>
          <p class="stat-value">{{ totalReservations }}</p>
        </div>

        <!--  Nombre total de personnes attendues -->
        <div class="card stat-card customers" @click="goToCustomers">
          <h5><i class="pi pi-users"></i> Personnes attendues</h5>
          <p class="stat-value">{{ totalGuests }}</p>
        </div>

        <!--  Pourcentage d'occupation des créneaux -->
        <div class="card stat-card chart-card">
          <h5><i class="pi pi-chart-pie"></i> Taux de remplissage</h5>
          <p class="stat-value">{{ occupancyRate }}%</p>
          <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[20rem]" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useDashboardStore } from "@/store/DashboardStore.js";
import Chart from 'primevue/chart';

export default {
  components: {
    Chart,
  },
  name: "Dashboard",
  data() {
    return {
      store: useDashboardStore(),
      chartOptions: {
        cutout: "60%",
      },
    };
  },
  computed: {
    totalReservations() {
      return this.store.totalReservations;
    },
    occupancyRate() {
      return this.store.occupancyRate;
    },
    totalGuests() {
      return this.store.totalGuests;
    },
    chartData() {
      return this.store.chartData; // Utilisation directe du store
    }
  },
  methods: {
    goToBooking() {
      this.$router.push("/booking");
    },
    goToCustomers() {
      this.$router.push("/customers");
    }
  },
  mounted() {
    this.store.fetchDashboardStats();
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
  margin-bottom: 50px;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}


.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
}


.stat-card {
  background-color: #1c2029;
  border-radius: 12px;
  color: white;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card h5 {
  font-size: 1rem;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #6c5ce7;
}

.chart-card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.resa, .customers  {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
