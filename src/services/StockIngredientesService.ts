import { StockArticuloVenta } from '../types/Stock/StockArticuloVenta';
import { StockIngredientes } from '../types/Stock/StockIngredientes';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const StockIngredientesService = {
    createStock: async (stock: StockIngredientes): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/stockIngredientes/create`, {
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

    getStock: async (): Promise<StockIngredientes[]> => {
        try {
            const response = await fetch(URL_API + 'stockIngredientes/' + sucursalId(), {
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

    getStockPorProducto: async (nombre: string): Promise<StockIngredientes> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/stock/${nombre}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.json();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    checkStock: async (idIngrediente: number, medidaId: number, cantidadNecesaria: number): Promise<boolean> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/stockIngredientes/check/${idIngrediente}/${medidaId}/${cantidadNecesaria}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.json();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateStock: async (stock: StockArticuloVenta | StockIngredientes): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/stockIngrediente/update`, {
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

    reponerStock: async (ingrediente: string, cantidad: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + `sucursal/${sucursalId()}/stockIngredientes/${ingrediente}/cantidad/${cantidad}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
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