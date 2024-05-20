import { ArticuloVenta } from '../types/Productos/ArticuloVenta';
import { StockArticuloVenta } from '../types/Stock/StockArticuloVenta';
import { StockArticuloVentaDTO } from '../types/Stock/StockArticuloVentaDTO';
import { StockIngredientesDTO } from '../types/Stock/StockIngredientesDTO';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const StockArticuloVentaService = {
    createStock: async (stock: StockArticuloVenta): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockArticuloVenta/create`, {
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

    getStock: async (): Promise<StockArticuloVentaDTO[]> => {
        try {
            const response = await fetch(URL_API + 'stockArticulos/' + sucursalId, {
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

    checkStock: async (articulo: ArticuloVenta): Promise<string> => {
        try {

            // Construir la URL con los parámetros de consulta
            const url = `${URL_API}sucursal/${sucursalId}/StockArticuloVenta/check?`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articulo)
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

    updateStock: async (stock: StockArticuloVentaDTO | StockIngredientesDTO): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockArticulo/update`, {
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
            const response = await fetch(URL_API + `sucursal/${sucursalId}/stockArticuloVenta/${stockId}/delete`, {
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