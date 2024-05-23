import { Categoria } from '../types/Ingredientes/Categoria';
import { URL_API } from '../utils/global_variables/const';

export const CategoriaService = {
    getCategorias: async (): Promise<Categoria[]> => {
        try {
            const response = await fetch(URL_API + 'categorias', {
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

    createCategoria: async (categoria: Categoria): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'categoria/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
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

    updateCategoria: async (categoria: Categoria): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'categoria/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
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

    deleteCategoria: async (categoriaId: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'categoria/' + categoriaId + '/delete', {
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