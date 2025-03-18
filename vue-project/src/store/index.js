import { createPinia } from "pinia";
import { useCustomerStore } from "@/store/CustomerStore";
import { useUserStore } from "@/store/UserStore";
import { useBookingStore } from "@/store/BookingStore.js";
import { useTableStore } from "@/store/TablesStore.js";
import { useDateCustomerStore } from "@/store/DateCustomerStore.js";
import { useOrgPageStore } from "@/store/OrgPageStore.js";
import { useLoginStore } from "@/store/LoginStore.js";

const pinia = createPinia();

export {
    useCustomerStore,
    useUserStore,
    useBookingStore,
    useTableStore,
    useDateCustomerStore,
    useOrgPageStore,
    useLoginStore,
};
export default pinia;