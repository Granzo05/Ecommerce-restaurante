import { Ingrediente } from '../types/Ingredientes/Ingrediente';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const IngredienteService = {
    getIngredientes: async (): Promise<Ingrediente[]> => {
        try {
            const response = await fetch(URL_API + 'ingredientes/' + sucursalId, {
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

    createIngrediente: async (ingrediente: Ingrediente): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'ingrediente/create/' + sucursalId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingrediente)
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

    updateIngrediente: async (ingrediente: Ingrediente): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'ingrediente/update/' + sucursalId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingrediente)
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