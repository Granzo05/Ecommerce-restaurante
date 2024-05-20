import { Localidad } from '../types/Domicilio/Localidad';
import { LocalidadDelivery } from '../types/Restaurante/LocalidadDelivery';
import { URL_API } from '../utils/global_variables/const';

export const LocalidadService = {
    getLocalidades: async (): Promise<Localidad[] | null> => {
        try {
            const response = await fetch(URL_API + `localidades`, {
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

    getLocalidadesDeliveryByIdSucursal: async (id: number): Promise<LocalidadDelivery[] | []> => {
        try {
            const response = await fetch(URL_API + `localidades/delivery/sucursal/${id}`, {
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

    getLocalidadesByNombreDepartamento: async (nombreDepartamento: string): Promise<Localidad[] | []> => {
        try {
            const response = await fetch(URL_API + `localidades/departamento/${nombreDepartamento}`, {
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

    getLocalidadesByNombreDepartamentoAndProvincia: async (nombreDepartamento: string, nombreProvincia: string): Promise<Localidad[] | []> => {
        try {
            const response = await fetch(URL_API + `localidades/${nombreDepartamento}/${nombreProvincia}`, {
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

    getLocalidadesByNombreProvincia: async (nombreProvincia: string): Promise<Localidad[] | []> => {
        try {
            const response = await fetch(URL_API + `localidades/provincia/${nombreProvincia}`, {
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