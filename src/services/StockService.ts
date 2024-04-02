import { Menu } from '../types/Menu';
import { Stock } from '../types/Stock';
import { URL_API } from '../utils/global_variables/const';

export const StockService = {
    createStock: async (stock: Stock): Promise<string> => {
        const response = await fetch(URL_API + 'stock/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stock)
        })

        const data = await response.json();

        return data;
    },

    getStock: async (): Promise<Stock[]> => {
        const response = await fetch(URL_API + 'stock')

        const data = await response.json();

        return data;
    },

    getStockProduct: async (name: string): Promise<Stock> => {
        const response = await fetch(URL_API + `stock/${name}`);

        const data = await response.json();

        return data;
    },

    checkStock: async (menus: Menu[]): Promise<string> => {
        const queryString = menus.map(menu => `id=${menu.id}`).join('&');

        // Construir la URL con los parámetros de consulta
        const url = `${URL_API}restaurante/stock/check?${queryString}`;

        // Realizar la solicitud GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.text();

    },

    updateStock: async (stock: Stock): Promise<Stock> => {
        const response = await fetch(URL_API + 'stock/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stock)
        })

        const data = await response.json();

        return data;
    },

    deleteStock: async (stockId: number): Promise<string> => {
        const response = await fetch(URL_API + 'stock/' + stockId + 'delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return await response.text();

    },
}