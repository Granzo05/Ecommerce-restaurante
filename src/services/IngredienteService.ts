import { Ingrediente } from '../types/Ingrediente';
import { URL_API } from '../utils/global_variables/const';

export const IngredienteService = {
    getIngredientes: async (): Promise<Ingrediente[]> => {
        try {
            const response = await fetch(URL_API + 'ingredientes', {
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

    updateIngrediente: async (ingrediente: Ingrediente): Promise<Ingrediente> => {
        try {
            const response = await fetch(URL_API + 'ingrediente/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingrediente)
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

    deleteStock: async (ingredienteId: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'ingrediente/' + ingredienteId + 'delete', {
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