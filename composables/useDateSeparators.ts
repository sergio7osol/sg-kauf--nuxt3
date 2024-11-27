import type DetailedDateInfo from '~/types/DetailedDateInfo';

export default function useDateSeparators(shoppingDates: DetailedDateInfo[], order: SortOrder = 'ascend') {
    // go through and add year/month separators
    shoppingDates.reduce((acc, v, i, src) => {
            let dateArr = null;
            let year = null;
            let month = null;

            if (v.date) {
                dateArr = v.date.split('.');
                year = dateArr[2];
                month = dateArr[1];

                if (acc.year !== year) {
                    acc.year = year;
                    src.splice(i, 0, {year});
                }

                if (acc.month !== month) {
                    acc.month = month;
                    src.splice(i, 0, {month});
                }
            }

            return acc;
        }, {
            year: null,
            month: null
        });
}
