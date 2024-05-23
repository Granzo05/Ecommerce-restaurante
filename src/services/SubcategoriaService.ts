import { Subcategoria } from '../types/Ingredientes/Subcategoria';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const SubcategoriaService = {
    getSubcategorias: async (): Promise<Subcategoria[]> => {
        try {
            const response = await fetch(URL_API + 'subcategorias/' + sucursalId, {
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

    createSubcategoria: async (subcategoria: Subcategoria): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'subcategoria/create/' + sucursalId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subcategoria)
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

    updateSubcategoria: async (subcategoria: Subcategoria): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'subcategoria/update/' + sucursalId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subcategoria)
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