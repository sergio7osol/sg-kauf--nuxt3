<script setup lang="ts">
import Datepicker from 'vue3-datepicker';
import type PriceInfo from "@/types/PriceInfo.d.ts";
import type { Currency } from "@/types/StaticBuyInfoTypes.d.ts";
import { useBuyDatesStore } from "@/stores/BuyDatesStore";

const buyDatesStore = useBuyDatesStore();

// const dateRange: DateRange = reactive({
// });
const from = ref<Date>(new Date(2021, 0, 15)); 
const to = ref<Date>(new Date()); 
const formattedFrom = computed(() => from.value.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}));
const formattedTo = computed(() => to.value.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}));
const currency: Currency = 'EUR'; // TODO: implement dynamic currency exchange / calculating different currencies separately
const calculatedSum = ref<PriceInfo>({ cost: 0, discount: 0 });
const roundedCost = computed(() => calculatedSum.value.cost ? calculatedSum.value.cost.toFixed(2) : 0);
const roundedDiscount = computed(() => calculatedSum.value.discount ? calculatedSum.value.discount.toFixed(2) : 0);
const roundedSum = computed(() => (calculatedSum.value.cost - calculatedSum.value.discount).toFixed(2));

const sendGetWholeSum = () => {
  buyDatesStore.getWholeSum()
    .then((result: any) => {
      calculatedSum.value = result;
    })
    .catch((err: Error) => {
      console.log('Fetch Error :-S', err);
    });
};

const getCalcSum = () => {
  const fromValue = getDateString(from.value);
  const toValue = getDateString(to.value);

  const urlSuffix = `from=${fromValue}&to=${toValue}`;
  buyDatesStore.getRangeSum(urlSuffix)
    .then((data: PriceInfo) => {
      calculatedSum.value = data;
    })
    .catch(function (err: unknown) {
      console.log('Fetch Error :-S', err);
    });

  function getDateString(date: Date) {
    const day = String(date.getDate());
    const dayNormalized = day.length < 2 ? '0' + day : day;
    const month = String(date.getMonth() + 1);
    const monthNormalized = month.length < 2 ? '0' + month : month;
    const year = date.getFullYear();

    const dateNormalized = dayNormalized + '.' + monthNormalized + '.' + year;

    return dateNormalized;
  }
};
</script>

<template>
  <div class="border-primary mb-3 sum-calc">
    <div class="card-header">{{ formattedFrom }} - {{ formattedTo }}</div>
    <div class="card-body text-info sum-calc__body">
      <div class="sum-calc__price">
        <h5 class="card-title sum-calc__title">
          {{ roundedSum }}</h5>
        <span class="sum-calc__currency">{{ currency }}</span>
      </div>
      <div class="sum-calc__payment mt-2">
        <div class="sum-calc__cost-col">
          <span class="sum-calc__payment-name">Cost: </span>
          <span class="sum-calc__payment-value">{{ roundedCost }}</span>
        </div>
        <div class="sum-calc__cost-col">
          <span class="sum-calc__payment-name">Discount: </span>
          <span class="sum-calc__payment-value">{{ roundedDiscount }}</span>
        </div>
      </div>
      <div class="card-body sum-calc__controls">
        <div class="sum-calc__set-range">
          <p>from - to</p>
          <client-only>
            <Datepicker v-model="from" input-format="dd.MM.yyyy" />
            <!--
              :upperLimit="to"
              :locale="locale"
              :lowerLimit="from"
              :startingView="to.toString()"
            -->
            <Datepicker v-model="to" :upperLimit="to" inputFormat="dd.MM.yyyy" />
          </client-only>
        </div>
        <div class="sum-calc__buttons">
          <button class="btn btn-success mt-4 sum-calc__submit" @click="getCalcSum">Calculate Sum</button>
          <button class="btn btn-info mt-3 sum-calc__submit" @click="sendGetWholeSum">Get whole Sum</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.sum-calc {
  background-color: var(--default-bg-color) !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd !important;
  border-radius: .5rem;
  margin-left: auto;
  overflow: hidden;
}

.card-header {
  background-color: #f2f2f2;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  color: #666;
  font-size: 1.3rem;
}

.sum-calc__body {
  display: flex;
  align-items: center;
  padding: .5rem; 
}

.sum-calc__price {
  padding-right: 1.5rem;
  border-right: 1px solid var(--default-menu-separator-color);
}

.sum-calc__payment {
  padding: 0 1.5rem;
}

.sum-calc__set-range {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-right: 1px solid var(--default-menu-separator-color);
  border-left: 1px solid var(--default-menu-separator-color);

  input {
    max-width: 100%;
  }
}

.sum-calc__controls {
  display: flex;
}

.sum-calc__buttons {
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
}

.sum-calc__title {
  display: inline-block;
  font-size: 2rem;
}

.sum-calc__currency {
  color: #ccc;
  font-size: 1.4rem;
  margin-left: .3rem;
  font-style: italic;
}
</style>
