import { Empleado } from '../types/Restaurante/Empleado'
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const EmpleadoService = {
    createEmpleado: async (empleado: Empleado): Promise<string> => {
        try {
            let response = await fetch(URL_API + 'empleado/create/' + sucursalId(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empleado)
            })

            if (!response.ok) {
                throw new Error(`Error al obtener datos(${response.status}): ${response.statusText}`);
            }

            return await response.text();

        } catch (error) {
            return 'Error al intentar cargar el empleado';
        }
    },

    getEmpleado: async (email: string, contraseña: string) => {
        fetch(URL_API + 'empleado/login/' + email + '/' + contraseña, {
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
                    email: data.email,
                    privilegios: data.privilegios
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
            const response = await fetch(URL_API + 'empleados/' + sucursalId(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },


    updateEmpleado: async (empleado: Empleado): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empleado/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empleado)
            })

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    deleteEmpleado: async (cuilEmpleado: string): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empleado/' + cuilEmpleado + '/delete/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    checkUser: async (): Promise<boolean> => {
        /*
        const empleadoStr: string | null = localStorage.getItem('usuario');
        const empleado: Empleado = empleadoStr ? JSON.parse(empleadoStr) : new Empleado();

        // Si no hay un usuario, o el usuario no cumple con los requisitos entonces se le niega la entrada
        if (!empleado || empleado.privilegios === null) {
            window.location.href = '/acceso-denegado';
        }

        // Si los privilegios son solo para el negocio entonces en caso de ser empleado se devuelve un false para no mostrarle las opciones donde no deberia poder acceder
        if (empleado && empleado.privilegios.match('empleado')) {
            return false;
        }
*/
        return true;
    }
}