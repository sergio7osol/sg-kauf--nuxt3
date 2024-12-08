
<script setup lang="ts">
  import { useBuyDatesStore } from '@/stores/BuyDatesStore';
  import type BuyInfo from '@/types/BuyInfo';

  defineProps<{ 
    buyData: BuyInfo
  }>();

  const buyDatesStore = useBuyDatesStore();
</script>
 
<template>
  <table class="table table-striped product-list__items buy-table">
    <caption class="buy-table__caption">
      {{ buyData.time }},
      {{ buyData.address.country }}
      {{ buyData.address.index }}
      {{ buyData.address.city }}
      {{ buyData.address.street }}
      {{ buyData.address.houseNumber }},
      {{ buyData.shopName }}
      - {{ buyData.payMethod }} -
      {{ buyData.currency }}
      <button class="btn btn--icon-remove" @click="buyDatesStore.removeBuy(buyData)"></button>
    </caption>
    <thead class="product product--default buy-table__head">
    <tr class="buy-table__row buy-table__head-row--head">
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">#</th>
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">Name</th>
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">Price</th>
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">Weight/Amount</th>
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">Measure</th>
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">Description</th>
      <th scope="col" class="buy-table__cell buy-table__head-cell--head">Discount</th>
      <th scope="col" class="buy-table__cell buy-table__cell--actions buy-table__head-cell--head">Actions</th>
    </tr> 
    </thead>
    <tbody class="product">
    <ProductAddNewItemTableRow :date="buyData.date" :time="buyData.time" :key="Date.now()" />
    <ProductItem v-for="(product, index) in buyData.products" 
      class="buy-table__row buy-table__head-row--body" 
      :date="buyData.date"
      :time="buyData.time"
      :shop-name="buyData.shopName"
      :product="product" 
      :index="index" 
      :key="product.name + index" 
    />
    </tbody>
  </table>
</template>

<style>
.buy-table {
  background-color: var(--default-table-bg-color);
}

.buy-table__caption {
  caption-side: top;
}

.buy-table__cell--actions {
  display: flex;
  justify-content: center;
}

.card {
  background-color: #ddd !important;
}

.btn--icon-remove {
  font-size: 1.7rem;
  color: #f00;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1.1;
  vertical-align: bottom;
}

.btn--icon-remove:hover {
  color: lighten(#f00, 10%);
}

.btn--icon-remove:active {
  color: darken(#f00, 10%);
}

.btn--icon-remove::before {
  content: "\2718";
}
</style>
