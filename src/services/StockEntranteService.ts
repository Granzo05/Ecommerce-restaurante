import { StockEntrante } from '../types/Stock/StockEntrante';
import { StockEntranteDTO } from '../types/Stock/StockEntranteDTO';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const StockEntranteService = {
    createStock: async (stock: StockEntrante): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/StockEntrante/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stock)
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getStock: async (): Promise<StockEntranteDTO[]> => {
        try {
            const response = await fetch(URL_API + 'stockEntrante/' + sucursalId, {
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

    updateStock: async (stock: StockEntranteDTO): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockEntrante/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stock)
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.text();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    deleteStock: async (stockId: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockEntrante/${stockId}/delete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}