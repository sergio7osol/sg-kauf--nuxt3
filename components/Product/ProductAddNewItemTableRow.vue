<script setup lang="ts">
import type { Ref } from 'vue';
import { useBuyDatesStore } from '@/stores/BuyDatesStore';
import useCollectionDefaults from '@/composables/useCollectionDefaults';
import type Product from '@/types/Product';

const { date, time } = defineProps<{
  date: string,
  time: string
}>();

const buyDatesStore = useBuyDatesStore();

const collectionDefaults = useCollectionDefaults();
const newProduct: Product = reactive({
  name: '',
  price: 0,
  weightAmount: 0,
  measure: 'piece',
  description: '',
  discount: 0
});
const toDefault = ref<boolean>(false);
const productNameTextField = ref<HTMLInputElement | null>(null);
const saveProductButton = ref<HTMLButtonElement | null>(null);
const sendProductToSave = () => {
  const { name, price, weightAmount, measure, description, discount } = newProduct;
  if (!name || !price || !weightAmount || !measure) {
    return console.warn('Name, price, weight/amount are required attributes and should be provided for saving a product. Returning...');
  }

  focusRefElement(productNameTextField);

  buyDatesStore.saveProduct(date, time, { ...newProduct }, toDefault.value)
    .then((data: boolean) => {
      if (data) {
        newProduct.name = '';
        newProduct.price = 0;
        newProduct.weightAmount = 0;
        newProduct.measure = 'piece';
        newProduct.description = '';
        newProduct.discount = 0;
      }
    });
};
const focusRefElement = (refElement: Ref<HTMLInputElement | HTMLButtonElement | null>) => refElement.value?.focus();
const productAutocomplete = (event: Event) => {
  const foundDefault = collectionDefaults.findDefaultValue(event);
  if (typeof foundDefault === 'object') {
    newProduct.name = foundDefault.name;
    newProduct.price = foundDefault.price || 0;
    newProduct.weightAmount = foundDefault.weightAmount || 1;
    newProduct.measure = foundDefault.measure || 'piece';
    newProduct.description = foundDefault.description || '';
    newProduct.discount = foundDefault.discount || 0;
    focusRefElement(saveProductButton);
  } else {
    newProduct.name = foundDefault;
    newProduct.price = 0;
    newProduct.weightAmount = 0;
    newProduct.measure = 'piece';
    newProduct.description = '';
    newProduct.discount = 0;
  }
};
const deriveProductName = (nameValue: string | Product) => typeof nameValue === 'string' ? nameValue : nameValue.name; // TODO: bring to a common interface

onMounted(() => {
  focusRefElement(productNameTextField);
});
</script>

<template>
  <tr class="buy-table__row buy-table__head-row--body buy-table__head-row--add">
    <td class="buy-table__cell"></td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <input
        class="form-control product-info__name"
        v-model="newProduct.name"
        ref="productNameTextField"
        @input="productAutocomplete"
        list="product-names"
        type="text"
      />
      <datalist id="product-names">
        <option
          v-for="(nameValue, index) in collectionDefaults.ValueCollection.value.defaults"
          :value="deriveProductName(nameValue)"
          :key="deriveProductName(nameValue) + String(index)"
        />
      </datalist>
    </td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <PriceInput
        placeholder="Price"
        :value="newProduct.price"
        @@price-changed="newProduct.price = $event"
      />
    </td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <input
        class="form-control product-info__weight-amount"
        v-model.number="newProduct.weightAmount"
        placeholder="Amount"
        step="0.001"
        type="number"
      />
    </td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <select
        class="form-control custom-select product-info__measure"
        v-model="newProduct.measure"
      >
        <option
          v-for="measureValue in collectionDefaults.ValueCollection.value.measures"
          :key="measureValue + Date.now()"
        >
          {{ measureValue }}
        </option>
      </select>
    </td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <input
        class="form-control product-info__description"
        v-model.trim="newProduct.description"
        placeholder="Description"
        list="product-descriptions"
        type="text"
      />
      <datalist id="product-descriptions">
        <option
          v-for="(description, index) in collectionDefaults.ValueCollection.value.descriptions"
          :value="description"
          :key="description + index"
        />
      </datalist>
    </td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <input
        class="form-control product-info__discount"
        v-model.number="newProduct.discount"
        placeholder="Discount"
        type="text"
      />
      <!-- pattern="d+\%?" -->
    </td>
    <td class="buy-table__cell buy-table__head-cell--body">
      <div class="product-info__buttons">
        <div class="form-check form-switch">
          <input
            id="addToDefaults"
            class="form-check-input"
            v-model="toDefault"
            role="switch"
            type="checkbox"
          />
          <label
            class="form-check-label"
            for="addToDefaults"
          >add to defaults</label>
        </div>
        <button
          class="btn btn-success btn-sm product-info__btn-add text-nowrap"
          type="button"
          ref="saveProductButton"
          @click.prevent="sendProductToSave"
        >
          Save product
        </button>
      </div>
    </td>
  </tr>
</template>

<style>
.buy-table__cell {
  vertical-align: middle;
}

.product {
  padding-left: 2rem;
}

.product--default {
  margin-left: 2rem;

  .product-info::before {
    content: none;
  }
}

.product__products {
  align-items: flex-start;
  margin-top: 1rem;
  font-size: .95rem;
  color: #565;
}

.product__badge {
  color: #fff;
  position: absolute;
  top: 18px;
  right: 12px;
}

.product .form-control {
  line-height: 1;
  height: 3rem;
  font-size: 1.2rem;
  border-radius: 0.4rem;
}

.product-info__name {
  /* width: 25rem; */
  margin-right: 1.5rem;
}

.product-info__price {
  width: 6rem;
}

.product-info__weight-and-measure {
  display: flex;
  margin-right: 1.5rem;
}

.product-info__weight-amount {
  width: 6rem;
  margin-right: 0.5rem;
}

.product-info__discount {
  width: 6rem;
}

.product-info__buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.product-info__btn-add {
  margin-left: 0.4rem;
}

.product-info {

  th,
  td {
    vertical-align: middle;
  }
}

.btn--icon-remove {
  font-size: 2rem;
  line-height: 1.1;
  color: #f00;
  padding-top: 0;
  padding-bottom: 0;
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

.form-switch {
  display: flex;
  align-items: center;
  line-height: 1;
  margin-bottom: .5rem;
  min-height: 1.2rem;
}

.form-switch:hover {
  cursor: pointer;
}

.form-switch .form-check-input {
  margin-top: 0;
}

.form-switch .form-check-label {
  margin-left: .4rem;
  font-size: .75rem;

  /* color: #bfbfbf; */
  .form-check-input:checked+& {
    color: #0d6efd;
  }
}
</style>
