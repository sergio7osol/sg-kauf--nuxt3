import axios from 'axios';
import type DetailedDateInfo from '@/types/DetailedDateInfo';
import type BuyInfo from '@/types/BuyInfo';
import type Product from '@/types/Product';
import type ResponseInfo from '@/types/ResponseInfo';
import type PriceInfo from '@/types/PriceInfo';
import type { ProductWithDate } from '@/types/Product';

const baseURL = 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export function getAllDates(): Promise<DetailedDateInfo[]> {
    return apiClient.get('/list-dates')
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        })
}
export function readDate(newDate: string): Promise<BuyInfo[]> {
    return apiClient.get(`/read-date?date=${newDate}`)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        })
}
export function postEvent(event: any) { // new post request
    return apiClient.post('/events', event)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        });
}
export async function createBuy(dataSuffix: string): Promise<ResponseInfo> {
    const { data, error } = await useFetch<ResponseInfo>(
      `${baseURL}/save-buy?${dataSuffix}`,
      {
        pick: ['success', 'message'],
        key: String(Date.now()),
      }
    );

    if (error.value) {
        showError({
          statusCode: 500,
          statusMessage: "Internal Server Error by creating a new buy",
        });

        return {
          success: false,
          message: "500 Internal Server Error fetching data for create buy",
        };
    } else if (data && data.value && data.value.success && data.value.message) {
      // TODO: change according to error codes that will be sent
      return {
        success: data.value.success,
        message: data.value.message,
      };
    } else {   
        showError({
          statusCode: 404,
          statusMessage: 'Error creating a new buy',
        });

        return {
          success: false,
          message: '404 Error fetching data for create buy',
        };
    }
}
export function deleteBuy(dataSuffix: string): Promise<BuyInfo[]> {
    return apiClient.get('/remove-buy?' + dataSuffix)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        });
}
export function getProductNames(): Promise<string[]> {
    return apiClient.get('/get-product-names')
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        });
}
export function getProductDescriptions(): Promise<string[]> {
    return apiClient.get('/get-product-descriptions')
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        });
}
export function getProductDefaults(): Promise<Array<string | Product>> {
    return apiClient.get('/get-product-defaults')
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        });
}
export function createProduct(dataSuffix: string): Promise<Product[]> {
    return apiClient.get(`/save-product?${dataSuffix}`)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        })
}
export function removeProduct(dataSuffix: string): Promise<ResponseInfo> {
    return apiClient.get(`/remove-product?${dataSuffix}`)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        })
}
export function getProductTimelineData(dataSuffix: string): Promise<ProductWithDate[]> {
    return apiClient.get(`/product-timeline?${dataSuffix}`)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        }) 
}
export function fetchRangeSum(dataSuffix: string): Promise<number> {
    return apiClient.get(`/get-calc-sum?${dataSuffix}`)
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        })
}
export function fetchWholeSum(): Promise<{ wholeSum: PriceInfo }> {
    return apiClient.get('/get-whole-sum')
        .then(response => {
            if (response.status !== 200) {
                throw Error('Looks like there was a problem. Status Code: ' + response.status);
            }
            return response.data;
        })
}
