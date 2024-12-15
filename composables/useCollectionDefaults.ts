import { useBuyDatesStore } from '@/stores/BuyDatesStore';
import type Product from '@/types/Product';

export default function useCollectionDefaults() {
  const buyDatesStore = useBuyDatesStore();
  const { ValueCollection } = storeToRefs(useBuyDatesStore());

  const findDefaultValue = (event: Event): Product | string => {
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    const trimmedCurrentValue = currentValue.trim();
    const foundDefault = ValueCollection.value.defaults.find((collectionItem) => {
      if (typeof collectionItem === 'string') {
        return collectionItem === trimmedCurrentValue;
      } else {
        return collectionItem?.name === trimmedCurrentValue;
      }
    });

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
