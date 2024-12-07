import { getAllDates, readDate, fetchWholeSum, fetchRangeSum } from '@/services/ShoppingDateService';
import type DetailedDateInfo from '@/types/DetailedDateInfo';
import type BuyInfo from "@/types/BuyInfo";

export const useBuyDatesStore = defineStore("BuyDatesStore", {
  state: () => ({
    shoppingDates: [] as DetailedDateInfo[],
    activeDate: {} as DetailedDateInfo,
    loadingDate: '', // TODO: make dependent of activeDate
    ValueCollection: {
      names: [],
      descriptions: [],
      defaults: [],
      measures: ["piece", "kg"],
    },
  }),
  getters: {},
  actions: {
    async getShoppingDates(): Promise<void> {
      try {
        const fetchedDates: DetailedDateInfo[] | false = await getAllDates();
        console.log('incoming short date info objects: ', fetchedDates && fetchedDates.length);

        if (fetchedDates && fetchedDates.length) {
          this.shoppingDates = fetchedDates;
        }
      } catch (error) {
        console.log("Error on getting shopping dates: ", error);
      }
    },
    setActiveDate(newDate: string): boolean {
      const dateToSelect = this.shoppingDates.find(item => item.date === newDate);
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
        this.loadingDate = "";

        return true;
      } else {
        readDate(newDate)
          .then((data: BuyInfo[]) => {
            if (data?.length) {
              dateToSelect.buys = data;
              dateToSelect.count !== undefined &&
                dateToSelect.count !== null &&
                Reflect.deleteProperty(dateToSelect, "count");
              this.activeDate = dateToSelect;
              this.loadingDate = "";
            }
          })
          .catch((err) => console.log("Fetch Error :-S", err));
        return true;
      }
    },
    chooseDate (date: string): void {
      this.loadingDate = date;
      this.setActiveDate(date);
    },
    getWholeSum() {
      return fetchWholeSum()
        .then((data) => {
          const wholeSum = data.wholeSum;
          return new Promise((resolve, reject) => {
            if (
              wholeSum &&
              typeof wholeSum === "object" &&
              typeof wholeSum.cost === "number" &&
              typeof wholeSum.discount === "number"
            ) {
              resolve(wholeSum);
            } else {
              reject(data);
            }
          });
        })
        .catch(function (err) {
          console.log("getWholeSum", "Fetch Error :-S", err);
        });
    }, 
    getRangeSum(dataSuffix: string) {
      return fetchRangeSum(dataSuffix);
    }
  },
});
  
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBuyDatesStore, import.meta.hot));
  }