import { Domicilio } from '../types/Domicilio/Domicilio';
import { URL_API } from '../utils/global_variables/const';

export const DomicilioService = {
    getDomiciliosEmpleado: async (idEmpleado: number): Promise<Domicilio[] | null> => {
        try {
            const response = await fetch(URL_API + `domicilios/${idEmpleado}`, {
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