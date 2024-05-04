import { Provincia } from '../types/Domicilio/Provincia';
import { URL_API } from '../utils/global_variables/const';

export const ProvinciaService = {
    getProvincias: async (): Promise<Provincia[] | null> => {
        try {
            const response = await fetch(URL_API + `provincias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
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

    createProvincias: async () => {
        try {
            const response = await fetch(URL_API + `provincias/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}