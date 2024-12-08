import { reactive, readonly } from 'vue';
import { find } from 'lodash';

import { createBuy, deleteBuy, getProductNames, getProductDescriptions, getProductDefaults, createProduct, removeProduct, getProductTimelineData, fetchRangeSum } from '@/services/ShoppingDateService';
import type SgKaufState from '@/types/SgKaufState';
import type SgKaufMethods from '@/types/SgKaufMethods';
import type DetailedDateInfo from '@/types/DetailedDateInfo';
import type BuyInfo from '@/types/BuyInfo';
import type ResponseInfo from '@/types/ResponseInfo';
import type Product from '@/types/Product';
import type PriceInfo from '@/types/PriceInfo';
import type { ProductTimelineRequestInfo } from '@/types/ProductTimelineInfo';
import type { ProductWithDate } from '@/types/Product';

interface SgKaufMethodsLocal extends SgKaufMethods {
  _breakPromiseExecution: () => Promise<false>;
  _addBuy: (newBuy: BuyInfo, storedDate: DetailedDateInfo | undefined, storedBuy: BuyInfo | undefined) => void;
  _setCollectionProductNames: (names: string[]) => void;
  _setCollectionOfProductDescriptions: (descriptions: string[]) => void;
  _setCollectionProductDefaults: (defaults: (string | Product)[]) => void;
}
const state: SgKaufState = reactive({
  shoppingDates: [],
  activeDate: {} as DetailedDateInfo,
  loadingDate: '', // TODO: make dependent of activeDate
  ValueCollection: {
    names: [],
    descriptions: [],
    defaults: [],
    measures: ['piece', 'kg'],
  },
});
const methods: SgKaufMethodsLocal = {
  // setActiveDate
  setLoadingDate(newDate: string) {
    state.loadingDate = newDate;
  },
  // saveBuy
  // removeBuy
  // fetchProductNames
  // fetchProductDescriptions
  // fetchProductDefaults
  // saveProduct,
  // removeProduct
  getProductTimelineInfo(productRequestInfo: ProductTimelineRequestInfo) {
    let { name, measure, shopName } = productRequestInfo;

    if (!(name && measure && shopName)) {
      console.log('Not enough data provided for requesting product timeline.');
      console.log(`Provided data: name: ${name}, measure: ${measure}, shopName: ${shopName}`);
      return methods._breakPromiseExecution();
    }

    const nameEncoded = encodeURIComponent(name);
    const shopNameEncoded = encodeURIComponent(shopName);
    let url = `name=${nameEncoded}&measure=${measure}&shopName=${shopNameEncoded}`;

    return getProductTimelineData(url)
      .then((data: ProductWithDate[] | false) => data)
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
        return false;
      });
  },
  // getRangeSum
  // getWholeSum,
  // _breakPromiseExecution
  // _addBuy
  // _setCollectionProductNames
  // _setCollectionOfProductDescriptions
  // _setCollectionProductDefaults
};

// export const storeInjectionKey = Symbol() as InjectionKey<{
//   state: SgKaufState;
//   methods: SgKaufMethods;
// }>;
