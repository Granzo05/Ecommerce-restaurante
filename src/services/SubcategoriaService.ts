import { Subcategoria } from '../types/Ingredientes/Subcategoria';
import { URL_API } from '../utils/global_variables/const';

export const SubcategoriaService = {
    getSubcategorias: async (): Promise<Subcategoria[]> => {
        try {
            const response = await fetch(URL_API + 'subcategoria', {
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
            const response = await fetch(URL_API + 'subcategoria/create', {
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
            const response = await fetch(URL_API + 'subcategoria/update', {
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

    deleteSubcategoria: async (subcategoriaId: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'subcategoria/' + subcategoriaId + '/delete', {
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