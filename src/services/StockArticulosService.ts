import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import { StockArticuloVenta } from '../types/Stock/StockArticuloVenta';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const StockArticuloVentaService = {
    createStock: async (stock: StockArticuloVenta): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/StockArticuloVenta/create`, {
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

    getStock: async (): Promise<StockArticuloVenta[]> => {
        try {
            const response = await fetch(URL_API + 'stock', {
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

    getStockProduct: async (nombre: string, cantidad: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockproduct/${nombre}/${cantidad}`, {
                method: 'GET',
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

    checkStock: async (menus: ArticuloMenu[]): Promise<string> => {
        try {
            const queryString = menus.map(menu => `id=${menu.id}`).join('&');

            // Construir la URL con los parámetros de consulta
            const url = `${URL_API}sucursal/${sucursalId}/StockArticuloVenta/check?${queryString}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.text();


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateStock: async (stock: StockArticuloVenta): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockIngrediente/update`, {
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
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockIngrediente/${stockId}/delete`, {
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