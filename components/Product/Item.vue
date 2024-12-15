<script setup lang="ts">
import { useBuyDatesStore } from '@/stores/BuyDatesStore';
import ProductPriceChartDialog from '@/components/Product/ProductPriceChartDialog.vue';
import type Product from "@/types/Product";
import type { ShopName } from "@/types/StaticBuyInfoTypes";

const { date, time, shopName } = defineProps<{
  date: string;
  time: string;
  shopName: ShopName;
  product: Product;
  index: number;
}>();

const buyDatesStore = useBuyDatesStore();
const graphShown = ref(false);
</script>

<template>
  <tr class="buy-table__row buy-table__head-row--body">
    <th
      scope="row"
      class="buy-table__cell buy-table__head-cell--body"
    >
      {{ index + 1 }}
    </th>
    <td class="buy-table__cell buy-table__head-cell--body">{{ product.name }}</td>
    <td class="buy-table__cell buy-table__head-cell--body">{{ product.price }}</td>
    <td class="buy-table__cell buy-table__head-cell--body">{{ product.weightAmount }}</td>
    <td class="buy-table__cell buy-table__head-cell--body">{{ product.measure }}</td>
    <td class="buy-table__cell buy-table__head-cell--body">{{ product.description }}</td>
    <td class="buy-table__cell buy-table__head-cell--body">{{ product.discount }}</td>
    <td class="buy-table__cell buy-table__cell--actions buy-table__head-cell--body">
      <button
        class="btn btn--icon-remove"
        @click.prevent="buyDatesStore.removeProduct(date, time, product)"
      ></button>
      <PrimeButton
        icon="pi pi-chart-line"
        @click="graphShown = !graphShown;"
        variant="text"
        aria-label="Show graph"
        rounded
      />
      <ProductPriceChartDialog
        :show-dialog="graphShown"
        :product-name="product.name"
        :measure="product.measure"
        :shop-name="shopName"
        @@close-dialog="graphShown = false"
      />
    </td>
  </tr>
</template>
