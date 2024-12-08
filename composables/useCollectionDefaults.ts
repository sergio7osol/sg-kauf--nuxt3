import { useBuyDatesStore } from '@/stores/BuyDatesStore';
import type Product from '@/types/Product';

export default function useCollectionDefaults() {
  const buyDatesStore = useBuyDatesStore();
  const { ValueCollection } = storeToRefs(useBuyDatesStore());

  const findDefaultValue = (event: Event): Product | string => {
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    const foundDefault = ValueCollection.value.defaults.find((defaultProductInfo) => defaultProductInfo.name === currentValue);

    return foundDefault ? foundDefault : currentValue;
  };

  onMounted(() => {
    buyDatesStore.fetchProductNames();
    buyDatesStore.fetchProductDescriptions();
    buyDatesStore.fetchProductDefaults();
  }); // TODO: before?

  return {
    ValueCollection,
    findDefaultValue,
  };
}
