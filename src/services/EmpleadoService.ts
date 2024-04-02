import { Empleado } from '../types/Empleado'
import { URL_API } from '../utils/global_variables/const';

export const EmpleadoService = {
    createEmpleado: async (nombre: string, apellido: string, email: string, contraseña: string, telefono: number, cuit: number) => {
        const empleado = {} as Empleado;

        empleado.nombre = `${nombre} ${apellido}`;
        empleado.email = email;
        empleado.contraseña = contraseña;
        empleado.telefono = telefono;
        empleado.cuit = cuit;

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
        const empleado = {} as Empleado;

        empleado.email = email;
        empleado.contraseña = contraseña;

        fetch(URL_API + 'empleado/login/' + empleado.email + '/' + empleado.contraseña, {
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
                localStorage.setItem('empleado', JSON.stringify(empleado));

                // Redirige al usuario al menú principal
                window.location.href = '/cocina'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getEmpleados: async (): Promise<Empleado[]> => {
        const response = await fetch(URL_API + 'empleados', {
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
            .catch(error => {
                console.error('Error:', error)
            })

        const data = await response.json();

        return data;
    },

    updateEmpleado: async (empleado: Empleado): Promise<string> => {
        const response = await fetch(URL_API + 'empleado/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleado)
        })

        return await response.text();

    },

    deleteEmpleado: async (empleado: Empleado): Promise<string> => {
        const response = await fetch(URL_API + 'empleado/delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleado)
        })

        return await response.text();

    },

    checkUser: async (privilegioRequerido: string) => {
        const empleadoStr: string | null = localStorage.getItem('usuario');

        let empleado: Empleado | null = null;
        if (empleadoStr) {
            try {
                empleado = JSON.parse(empleadoStr);
                if (empleado) {
                    fetch(URL_API + 'check/' + empleado.email + '/' + privilegioRequerido, {
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
                            console.log(data)
                            if (!data) {
                                window.location.href = '/acceso-denegado';
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error)
                        })
                }
            } catch (error) {
                window.location.href = '/acceso-denegado';
            }
        }
    },
}