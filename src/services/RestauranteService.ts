import { Empleado } from '../types/Empleado';
import { Restaurante } from '../types/Restaurante';
import { URL_API } from '../utils/global_variables/const';

export const RestauranteService = {
    createRestaurant: async (email: string, contraseña: string, domicilio: string, telefono: number) => {
        const restaurante = {} as Restaurante;

        restaurante.email = email;
        restaurante.contraseña = contraseña;
        restaurante.telefono = telefono;
        restaurante.domicilio = domicilio;
        // Creamos el restaurante en la db
        await fetch('http://localhost:8080/restaurante/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restaurante)
        })
            .then(async response => {
                if (!response.ok) {
                    // MOSTRAR CARTEL DE QUE HUBO ALGUN ERROR
                    throw new Error('Restaurante existente')
                }
                return await response.json()
            })
            .then(data => {
                let restaurante = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono
                }
                localStorage.setItem('usuario', JSON.stringify(restaurante));

                // Redirige al usuario al menú principal
                window.location.href = '/'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getRestaurant: async (email: string, contraseña: string) => {
        await fetch('http://localhost:8080/restaurant/login/' + email + '/' + contraseña, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Usuario existente')
                }

                return await response.json()
            })
            .then(data => {
                console.log(data)
                let restaurante = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono
                }

                localStorage.setItem('usuario', JSON.stringify(restaurante));

                // Redirige al usuario al menú principal
                window.location.href = '/'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    updateRestaurant: async (restaurante: Restaurante): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'restaurant/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(restaurante)
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

    checkPrivilegies: async (): Promise<boolean> => {
        const empleadoStr: string | null = localStorage.getItem('usuario');

        let empleado: Empleado | null = null;
        if (empleadoStr) {
            try {
                empleado = JSON.parse(empleadoStr);
                if (empleado) {
                    const response = await fetch(URL_API + 'check/' + empleado.email, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })

                    if (!response.ok) {
                        localStorage.removeItem('usuario');
                        return false;
                    }

                    const data = await response.json();
                    return data;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        return false;
    },

}