import { Imagenes } from '../types/Productos/Imagenes';
import { Empleado } from '../types/Restaurante/Empleado'
import { getBaseUrl, limpiarCredenciales, sucursalId, URL_API } from '../utils/global_variables/const';

export const EmpleadoService = {
    createEmpleado: async (empleado: Empleado, imagenes: Imagenes[]): Promise<string> => {
        try {
            let response = await fetch(URL_API + 'empleado/create/' + sucursalId(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empleado)
            })

            let cargarImagenes = true;

            if (!response.ok) {
                cargarImagenes = false;
                throw new Error(await response.text());
            }

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('cuilEmpleado', empleado.cuil);

                        await fetch(URL_API + 'empleado/imagenes/' + sucursalId(), {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));
            }

            return await response.text();

        } catch (error) {
            console.log(error)
            throw new Error ('Error al intentar cargar el empleado');
        }
    },

    getEmpleado: async (email: string, contraseña: string) => {
        limpiarCredenciales();
        try {
            const response = await fetch(URL_API + 'empleado/login/' + email + '/' + contraseña, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const data = await response.json();

            if (data.id > 0) {
                let empleado = {
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email,
                    empleadoPrivilegios: data.empleadoPrivilegios,
                    sucursales: data.sucursales
                }

                limpiarCredenciales();

                localStorage.setItem('empleado', JSON.stringify(empleado));

                // Redirige al usuario al menú principal
                window.location.href = getBaseUrl() + '/opciones';

                return 'Sesión iniciada correctamente';
            } else {
                throw new Error('Los datos ingresados no corresponden a una cuenta activa');
            }
        }
        catch (error) {
            throw new Error('Los datos ingresados no corresponden a una cuenta activa');
        }
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

    getCantidadCocineros: async (): Promise<number> => {
        try {
            const response = await fetch(URL_API + 'cocineros/' + sucursalId(), {
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

    updateEmpleado: async (empleado: Empleado, imagenes: Imagenes[], imagenesEliminadas: Imagenes[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'empleado/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empleado)
            })

            let cargarImagenes = true;

            if (!response.ok) {
                cargarImagenes = false;
                throw new Error(await response.text());
            }

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes && (imagenes || imagenesEliminadas)) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('cuilEmpleado', empleado.cuil);

                        await fetch(URL_API + 'empleado/imagenes/' + sucursalId(), {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(URL_API + 'empleado/imagen/' + imagen.id + '/delete', {
                            method: 'PUT',
                        });
                    }));
                }
            }

            return response.text();

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