import { Empleado } from '../types/Empleado'
import { URL_API } from '../utils/global_variables/const';

export const EmpleadoService = {
    createEmpleado: async (empleado: Empleado) => {
        empleado.nombre = `${empleado.nombre} ${empleado.apellido}`;
        fetch(URL_API + 'empleado/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleado)
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
                }
                return await response.json()
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getEmpleado: async (email: string, contraseña: string) => {
        fetch('http://localhost:8080/restaurant/login/' + email + '/' + contraseña, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
                }
                return await response.json()
            })
            .then(data => {
                let empleado = {
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email
                }
                localStorage.setItem('usuario', JSON.stringify(empleado));

                // Redirige al usuario al menú principal
                window.location.href = '/cocina'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getEmpleados: async (): Promise<Empleado[]> => {
        try {
            const response = await fetch(URL_API + 'empleados', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            const data: Empleado[] = await response.json();

            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    updateEmpleado: async (empleado: Empleado): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empleado/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empleado)
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    deleteEmpleado: async (empleadoId: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empleado/' + empleadoId + '/delete', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    checkUser: async (privilegioRequerido: string) => {
        const empleadoStr: string | null = localStorage.getItem('usuario');

        if (!empleadoStr) {
            window.location.href = '/acceso-denegado';
            return;
        }

        try {
            const empleado: Empleado = JSON.parse(empleadoStr);

            const response = await fetch(URL_API + 'check/' + empleado.email + '/' + privilegioRequerido, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            const data = await response.json();

            if (!data) {
                window.location.href = '/acceso-denegado';
            }
        } catch (error) {
            console.error('Error:', error);
            window.location.href = '/acceso-denegado';
        }
    }



}