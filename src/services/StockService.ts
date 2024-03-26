import { Menu } from '../types/Menu';
import { Stock } from '../types/Stock';
import { User } from '../types/User'
import { URL_API } from '../utils/global_variables/const';

export const UserService = {
    createUser: async (user: User): Promise<string> => {
        const response = await fetch(URL_API + 'user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
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
        const url = `${URL_API}restaurant/stock/check?${queryString}`;

        // Realizar la solicitud GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        return data;
    },

    createStock: async (menu: Menu): Promise<string> => {
        const response = await fetch(`${URL_API}restaurant/stock/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menu)
        });

        const data = await response.json();

        return data;
    },

    updateUser: async (stock: Stock): Promise<Stock> => {
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

    deleteUser: async (stockNameIngredient: Stock): Promise<string> => {
        const response = await fetch(URL_API + 'stock/delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stockNameIngredient)
        })

        const data = await response.json();

        return data;
    },
}