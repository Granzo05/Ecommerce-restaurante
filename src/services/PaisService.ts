import { Pais } from '../types/Domicilio/Pais';

export const PaisService = {
    getPaises: async (): Promise<Pais[] | []> => {
        try {
            const response = await fetch(process.env.URL_API + `paises`, {
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
}