import { Imagenes } from '../types/Productos/Imagenes';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { SucursalDTO } from '../types/Restaurante/SucursalDTO';
import { getBaseUrl, URL_API } from '../utils/global_variables/const';
import { EmpleadoService } from './EmpleadoService';

export const SucursalService = {
    createSucursal: async (sucursal: Sucursal, imagenes: Imagenes[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'sucursal/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sucursal)
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
                        formData.append('nombreSucursal', sucursal.nombre);

                        await fetch(URL_API + 'sucursal/imagenes', {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw new Error('Credenciales inválidas');
        }
    },

    getSucursal: async (email: string, contraseña: string) => {
        try {
            const response = await fetch(URL_API + 'sucursal/login/' + email + '/' + contraseña, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const data = await response.json();

            if (data.id !== null) {
                let sucursal = {
                    id: data.id,
                    nombre: data.nombre
                }

                localStorage.setItem('sucursal', JSON.stringify(sucursal));

                window.location.href = getBaseUrl() + '/opciones';
                return;
            } else {
                EmpleadoService.getEmpleado(email, contraseña);
            }

            return 'Los datos ingresados no corresponden a una cuenta activa';

        } catch (error) {
            console.error('Error:', error);
        }
    },

    getSucursales: async (): Promise<Sucursal[]> => {
        try {
            const response = await fetch(URL_API + 'sucursales/' + 1, {
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

    getSucursalDTOById: async (idSucursal: number): Promise<SucursalDTO | null> => {
        try {
            const response = await fetch(URL_API + 'sucursal/' + idSucursal, {
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

    updateSucursal: async (sucursal: Sucursal, imagenes: Imagenes[], imagenesEliminadas: Imagenes[]) => {
        try {
            const response = await fetch(URL_API + 'sucursal/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sucursal)
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
                        formData.append('nombreSucursal', sucursal.nombre);

                        await fetch(URL_API + 'sucursal/imagenes/', {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(URL_API + 'sucursal/imagen/' + imagen.id + '/delete', {
                            method: 'PUT',
                        });
                    }));
                }
            }

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateBorrado: async (sucursal: Sucursal) => {
        try {
            const response = await fetch(URL_API + 'sucursal/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sucursal)
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