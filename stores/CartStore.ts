import { defineStore } from "pinia";
import type BuyInfo from '@/types/BuyInfo';

const useCartStore = defineStore("CartStore", {
  state() {
    return {
      buys: [] as BuyInfo[]
    };
  },
});
