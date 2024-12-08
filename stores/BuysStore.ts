import {  } from '@/services/ShoppingDateService';
import type BuyInfo from "@/types/BuyInfo";

export const useBuysStore = defineStore("BuyDatesStore", {
  state: () => ({
    
  }),
  getters: {},
  actions: {
    
  },
});
  
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBuysStore, import.meta.hot));
  }