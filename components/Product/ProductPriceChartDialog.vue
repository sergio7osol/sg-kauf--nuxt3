<script setup lang="ts">
import { useBuyDatesStore } from '@/stores/BuyDatesStore';
import type { ProductWithDate } from "@/types/Product";
import type { ProductTimelineRequestInfo } from "@/types/ProductTimelineInfo";
import type { Measure, ShopName } from "@/types/StaticBuyInfoTypes";

const props = defineProps<{
  showDialog: boolean;
  productName: string;
  measure: Measure;
  shopName: ShopName;
}>();
const emit = defineEmits<{
  (e: "@close-dialog"): void;
}>();

const buyDatesStore = useBuyDatesStore();
const { activeDate } = storeToRefs(useBuyDatesStore());
const priceTimeline = ref<[number, number][]>([]);

const showComparisonGraph = (productTimelineRequest: ProductTimelineRequestInfo) => {
  if (!props.showDialog) {
    return false;
  }

  let { name, measure, shopName: shopNameUsed } = productTimelineRequest;
  if (!(name && measure && shopNameUsed)) {
    console.log("Not enough data provided for requesting product timeline.");
    console.log(
      `Provided data: name: ${name}, measure: ${measure}, shopName: ${shopNameUsed}`
    );
    return false;
  }

  buyDatesStore.getProductTimelineInfo(productTimelineRequest)
    .then((result: ProductWithDate[] | false) => {
      if (!(result && result.length)) return false;

      const datePriceChartData = result.reduce(
        (acc: Array<[number, number]>, v: ProductWithDate): Array<[number, number]> => {
          const dateArr = v.date.split('.');
          const year = Number(dateArr[2]);
          const month = Number(dateArr[1]) - 1;
          const day = Number(dateArr[0]);
          const date = Date.UTC(year, month, day);
          const price = v.price;

          return [...acc, [date, price]];
        },
        []
      );
      if (datePriceChartData?.length) {
        priceTimeline.value = datePriceChartData.sort((a, b) => a[0] - b[0]);
      }
    })
    .catch((err) => {
      console.log("Product timeline view error: ", err);
      return false;
    });
};

watch(props, ({ productName, measure, shopName }) => {
  showComparisonGraph({ name: productName, measure, shopName });
});
</script>

<template>
  <PrimeDialog
    :visible="showDialog"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :dismissable-mask="true"
  >
    <p>Active date: {{ activeDate.date }}</p>
    <p>
      <b>{{ priceTimeline.length }}</b> buys
    </p>
    <ProductPriceChart
      :chart-data="priceTimeline"
      :product-name="productName"
      :shop-name="props.shopName"
    />

    <template #footer>
      <PrimeButton
        label="Close"
        icon="pi pi-times"
        @click="emit('@close-dialog')"
        autofocus
      />
      <PrimeButton
        label="Yes"
        icon="pi pi-check"
        class="p-button-text"
        @click=""
      />
    </template>
  </PrimeDialog>
</template>
