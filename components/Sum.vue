<script setup lang="ts">
import { useBuyDatesStore } from '@/stores/BuyDatesStore';
import type { Currency } from '@/types/StaticBuyInfoTypes';
import type PriceInfo from "@/types/PriceInfo";
import type BuyInfo from '@/types/BuyInfo';

const { activeDate } = storeToRefs(useBuyDatesStore());

const activeSum = computed<PriceInfo>(() => {
  const sum = activeDate?.value?.buys?.reduce((buySum: PriceInfo, buy: BuyInfo) => {
    const products = buy.products;
    let resultProductSum = null;

    if (products) {
      resultProductSum = products.reduce((productSum, product) => {
        const { price, weightAmount, discount } = product;
        let lastLetter = null;
        let discountNumber = null;
        let discountFactor = null;

        productSum.cost += price * weightAmount;

        if (typeof discount === 'string') {
          lastLetter = discount.slice(-1);
          if (lastLetter !== '%') {
            throw Error('The last symbol in the discount string value should be %. Program exits.');
          }
          discountNumber = Number(discount.slice(0, -1))
          discountFactor = (price / 100) * discountNumber;
        } else if (typeof discount === 'number') {
          discountFactor = (price * discount / 100);
        } else {
          throw Error('"discount" product prop should be either percentage of type "string" ("%" at the end) or "number". Program exits.');
        }
        productSum.discount += discountFactor * weightAmount;

        return productSum;
      }, { cost: 0, discount: 0 });

      buySum.cost += resultProductSum.cost;
      buySum.discount += resultProductSum.discount;
    }

    return buySum;
  }, { cost: 0, discount: 0 });

  return sum || { cost: 0, discount: 0 };
});

const roundedCost = computed(() => activeSum.value.cost.toFixed(2));
const roundedDiscount = computed(() => activeSum.value.discount.toFixed(2));
const roundedSum = computed(() => {
  const resultCost = activeSum.value.cost - activeSum.value.discount;
  const fixedResultCost = resultCost.toFixed(2);
  return fixedResultCost;
});
const activeCurrency = computed<Currency | string>(() => {  // TODO: make converting to one currency for all buys (in case they are different)
  const firstBuyCurrency = activeDate.value.buys && activeDate.value.buys[0].currency;
  return firstBuyCurrency ? firstBuyCurrency : '';
});
</script>

<template>
  <div class="card border-primary sum">
    <div class="card-body text-primary sum__body">
      <div class="sum__price-per-day">
        <div class="sum__actual-price">
          <h5 class="card-title sum__quantity">
            {{ roundedSum }}</h5>
          <span class="sum__currency">{{ activeCurrency }}</span>
        </div>
        <p class="card-text sum__period">Day</p>
      </div>
      <div class="sum__payment mt-2">
        <div class="sum__cost-col">
          <span class="sum__payment-name">Cost: </span>
          <span class="sum__payment-value">{{ roundedCost }}</span>
        </div>
        <div class="sum__cost-col">
          <span class="sum__payment-name">Discount: </span>
          <span class="sum__payment-value">{{ roundedDiscount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sum {
  background-color: var(--default-bg-color) !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(255, 255, 255, 0.8);
  border: 1px solid #efefef !important;
  margin-left: 1.5rem;
  max-width: 20rem;
}

.sum__body {
  display: flex;
  flex-direction: column;
}

.sum__actual-price {}

.sum__price-per-day {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px dashed #aaa;
  padding: 0.1rem 0.4rem;
}

.sum__quantity {
  display: inline-block;
  font-size: 2rem;
}

.sum__currency {
  color: #aaa;
  font-size: 1.4rem;
  margin-left: .3rem;
  font-style: italic;
}

.sum__payment {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: .1rem .4rem;
  margin-top: .7rem;
}

.sum__payment-name {
  font-size: .9rem;
  color: #aaa;
}

.sum__cost-col:last-child {
  margin-left: 1rem;
}

.sum__period {
  margin-right: 1rem;
}
</style>
