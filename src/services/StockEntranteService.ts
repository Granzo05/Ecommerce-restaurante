import { StockEntrante } from '../types/Stock/StockEntrante';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const StockEntranteService = {
    createStock: async (stock: StockEntrante): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/StockEntrante/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stock)
            })
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getStockPendiente: async (): Promise<StockEntrante[]> => {
        try {
            const response = await fetch(URL_API + 'stockEntrante/pendientes/' + sucursalId(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getStockEntregados: async (): Promise<StockEntrante[]> => {
        try {
            const response = await fetch(URL_API + 'stockEntrante/entregados/' + sucursalId(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateStock: async (stock: StockEntrante): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/stockEntrante/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stock)
            })
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}