import { Medida } from '../types/Ingredientes/Medida';
import { URL_API } from '../utils/global_variables/const';

export const MedidaService = {
    getMedidas: async (): Promise<Medida[]> => {
        try {
            const response = await fetch(URL_API + 'medidas', {
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

    createMedida: async (medida: Medida): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'medida/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medida)
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

    updateMedida: async (medida: Medida): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'medida/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medida)
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

    deleteMedida: async (medidaId: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'medida/' + medidaId + '/delete', {
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