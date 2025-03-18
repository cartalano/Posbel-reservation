import { createRouter, createWebHistory } from 'vue-router';
import Login from "@/components/Login.vue";
import Tables from "@/components/Tables.vue";
import Customers from "@/components/Customers.vue";
import DateCustomer from "@/components/DateCustomer.vue";
import Users from "@/components/Users.vue";
import OrgPage from "@/components/OrgPage.vue";
import Home from "@/components/Dashboard.vue";
import Booking from "@/components/Booking.vue";

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/booking",
        component: Booking,

    },
    {
        path: "/tables",
        component: Tables,
    },
    {
        path: "/customers",
        component: Customers,
    },
    {
        path: "/reservation",
        component: DateCustomer,
    },
    {
        path: "/users",
        component: Users,
    },
    {
        path: "/org",
        component: OrgPage,
    },
    {
        path: "/home",
        component: Home,
    }

]

const router = createRouter( {
    history: createWebHistory(),
    routes,
});

export default router;