import { getAllDates, readDate, deleteBuy, removeProduct, fetchWholeSum, fetchRangeSum } from "@/services/ShoppingDateService";
import type DetailedDateInfo from "@/types/DetailedDateInfo";
import type BuyInfo from "@/types/BuyInfo";
import type Product from "@/types/Product";

export const useBuyDatesStore = defineStore("BuyDatesStore", {
  state: () => ({
    shoppingDates: [] as DetailedDateInfo[],
    activeDate: {} as DetailedDateInfo,
    loadingDate: '', // TODO: make dependent of activeDate
    ValueCollection: {
      names: [],
      descriptions: [],
      defaults: [],
      measures: ['piece', 'kg'],
    },
  }),
  getters: {},
  actions: {
    async getShoppingDates(): Promise<void> {
      try {
        const fetchedDates: DetailedDateInfo[] | false = await getAllDates();
        console.log(
          'incoming short date info objects: ',
          fetchedDates && fetchedDates.length
        );

        if (fetchedDates && fetchedDates.length) {
          this.shoppingDates = fetchedDates;
        }
      } catch (error) {
        console.log('Error on getting shopping dates: ', error);
      }
    },
    setActiveDate(newDate: string): boolean {
      const dateToSelect = this.shoppingDates.find(
        (item) => item.date === newDate
      );
      console.log('dateToSelect: ', dateToSelect);
      if (!dateToSelect) {
        console.warn(
          `Chosen date ${newDate} for loading buys was not found. No date is selected.`
        );
        this.activeDate = {} as DetailedDateInfo;

        return false;
      }
      if (dateToSelect.buys) {
        this.activeDate = { ...dateToSelect };
        this.loadingDate = '';

        return true;
      } else {
        readDate(newDate)
          .then((data: BuyInfo[]) => {
            if (data?.length) {
              dateToSelect.buys = data;
              dateToSelect.count !== undefined &&
                dateToSelect.count !== null &&
                Reflect.deleteProperty(dateToSelect, 'count');
              this.activeDate = dateToSelect;
              this.loadingDate = "";
            }
          })
          .catch((err) => console.log('Fetch Error :-S', err));
        return true;
      }
    },
    chooseDate(date: string): void {
      this.loadingDate = date;
      this.setActiveDate(date);
    },
    removeBuy(buy: BuyInfo) {
      const existingShoppingDate = this.shoppingDates.find(
        (shoppingDate: DetailedDateInfo) => shoppingDate.date === buy.date
      );
      const existingBuy =
        existingShoppingDate &&
        existingShoppingDate.buys?.find(
          (buyItem: BuyInfo) => buyItem.time === buy.time
        );
      if (!existingBuy) {
        console.warn(
          `Buy for deleting on ${buy.date} at ${buy.time} was not found.`
        );
        return false;
      }

      if (confirm('Are you sure, you want to delete this buy?')) {
        console.log(
          `Prompted deleting of the buy. Confirmed. The buy on ${buy.date} at ${buy.time} is going to be deleted...`
        );
      } else {
        console.log(
          `Prompted deleting of the buy. Rejected. The buy on ${buy.date} at ${buy.time} is NOT going to be deleted.`
        );
        return false;
      }
      const urlSuffix = `date=${buy.date}&time=${buy.time}`;

      deleteBuy(urlSuffix) // TODO: make no response from server -> do it locally
        .then((newArray: BuyInfo[]) => {
          if (newArray) {
            console.log(
              `The buy on ${buy.date} at ${buy.time} was successfully removed. ${newArray.length} buys left for this date.`
            );
            if (newArray.length) {
              if (existingShoppingDate && existingShoppingDate.buys) {
                existingShoppingDate.buys = newArray;
              }
            } else if (existingShoppingDate) {
              console.log(
                `Date ${buy.date} with no buys left is going to be removed...`
              );
              const indexOfDateToDelete =
                this.shoppingDates.indexOf(existingShoppingDate);
              console.log('index of date to delete: ', indexOfDateToDelete);
              this.shoppingDates.splice(indexOfDateToDelete, 1);
              this.setActiveDate('');

              // TODO: add another possibility for deleting date - separately
              //   if (confirm(`There are no buys left for date ${buy.date}, do you want to delete this shopping date completely?`)) {
              //     console.log(`Prompted deleting of the date. Confirmed. The date ${buy.date} is going to be deleted...`);
              //     const indexOfDateToDelete = state.shoppingDates.find(shoppingDate => shoppingDate === existingShoppingDate);
              //     console.log('indexOfDateToDelete > ', indexOfDateToDelete);
              //   } else {
              //     console.log(`Prompted deleting of the date. Rejected. The date ${buy.date} is NOT going to be deleted.`);
              //     return false;
              //   }
            }
          }
        })
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });
    },
    removeProduct(date: string, time: string, productInfoForRemove: Product) {
      const { name, price, weightAmount, measure, description, discount } =
        productInfoForRemove;

      if (confirm('You sure, you want to delete this product?')) {
        console.log(
          `Prompted deleting of the product. Confirmed. The product ${name} on ${date} at ${time} is going to be deleted...`
        );
      } else {
        console.log(
          `Prompted deleting of the product. Rejected. The product ${name} on ${date} at ${time} is NOT going to be deleted.`
        );
        return false;
      }

      const nameEncoded = encodeURIComponent(name);
      let url = `date=${date}&time=${time}&name=${nameEncoded}&price=${price}&weightAmount=${weightAmount}&measure=${measure}&discount=${discount}`;
      url += description ? `&description=${description}` : "";

      return removeProduct(url)
        .then((data) => {
          if (!data.success) {
            console.log('Error. Program stops. ', data.error);
            return false;
          }
          console.log(
            `Server response -> operation completed: status: ${
              data.success ? "success" : "failure"
            }, description: ${data.message}`
          );
          const dateToRemoveProductFrom = this.shoppingDates?.find(
            (shoppingDate) => shoppingDate.date === date
          );
          if (!dateToRemoveProductFrom) {
            console.error(
              `Date ${date} to remove the product from - is not found`
            );
            return false;
          }
          const buyToRemoveProductFrom = dateToRemoveProductFrom.buys?.find(
            (buy) => buy.time === time
          );
          if (!buyToRemoveProductFrom) {
            console.error(
              `Buy at ${time} to remove the product from - is not found`
            );
            return false;
          }
          const resultProducts = buyToRemoveProductFrom.products.filter(
            (buy) => {
              const isProductToDelete =
                buy.name === name &&
                buy.price === price &&
                buy.weightAmount === weightAmount &&
                buy.measure === measure &&
                buy.discount === discount &&
                buy.description === description;
              return isProductToDelete ? false : true;
            }
          );
          if (
            buyToRemoveProductFrom.products.length === resultProducts.length
          ) {
            console.log(
              `Product for deletion ${name} was not found locally on ${date} at ${time}`
            );
            return false;
          }
          buyToRemoveProductFrom.products = resultProducts;
        })
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });
    },
    getWholeSum() {
      return fetchWholeSum()
        .then((data) => {
          const wholeSum = data.wholeSum;
          return new Promise((resolve, reject) => {
            if (
              wholeSum &&
              typeof wholeSum === 'object' &&
              typeof wholeSum.cost === 'number' &&
              typeof wholeSum.discount === 'number'
            ) {
              resolve(wholeSum);
            } else {
              reject(data);
            }
          });
        })
        .catch(function (err) {
          console.log('getWholeSum', 'Fetch Error :-S', err);
        });
    },
    getRangeSum(dataSuffix: string) {
      return fetchRangeSum(dataSuffix);
    },
  },
});
  
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBuyDatesStore, import.meta.hot));
  }