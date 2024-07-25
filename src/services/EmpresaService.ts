import { Imagenes } from '../types/Productos/Imagenes';
import { Empresa } from '../types/Restaurante/Empresa';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { empresaId, getBaseUrl, limpiarCredenciales } from '../utils/global_variables/const';
import { EmpleadoService } from './EmpleadoService';
import { SucursalService } from './SucursalService';

export const EmpresaService = {
    createEmpresa: async (empresa: Empresa, imagenes: Imagenes[]): Promise<string> => {
        const response = await fetch(process.env.URL_API + 'empresa/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresa)
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
                    formData.append('cuit', empresa.cuit);

                    await fetch(process.env.URL_API + 'empresa/imagenes', {
                        method: 'POST',
                        body: formData
                    });
                }
            }));
        }

        return await response.text();
    },

    getSucursales: async (): Promise<Sucursal[]> => {
        try {
            const response = await fetch(process.env.URL_API + 'sucursales/' + empresaId(), {
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

    getEmpresa: async (email: string, contraseña: string): Promise<string> => {
        limpiarCredenciales();
        try {
            const response = await fetch(process.env.URL_API + 'empresa/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, contraseña })
            });

            if (response.ok) {
                const data = await response.json();

                let restaurante = {
                    id: data.id,
                    nombre: data.nombre
                };

                localStorage.setItem('empresa', JSON.stringify(restaurante));

                window.location.href = getBaseUrl() + '/empresa';

                return 'Sesión iniciada correctamente';
            } else {
                // Intentar iniciar sesión como sucursal
                const mensajeSucursal = await SucursalService.getSucursal(email, contraseña);
                if (mensajeSucursal.ok) {
                    return 'Sesión iniciada correctamente';
                } else {
                    // Intentar iniciar sesión como empleado
                    const mensajeEmpleado = await EmpleadoService.getEmpleado(email, contraseña);
                    if (mensajeEmpleado.ok) {
                        return 'Sesión iniciada correctamente';
                    } else {
                        throw new Error('Los datos ingresados no corresponden a una cuenta activa');
                    }
                }
            }
        } catch (error) {
            throw new Error('Ocurrió un error al intentar iniciar sesión');
        }
    },

    getEmpresaCredentials: async (cuit: string, contraseña: string) => {
        try {
            const response = await fetch(process.env.URL_API + 'empresa/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cuit, contraseña })
            });

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const data = await response.json();

            if (data.id > 0) {
                window.location.href = getBaseUrl() + '/empresa';
                return 'Acceso concedido';
            } else {
                throw new Error('Los datos ingresados no corresponden a una empresa');
            }
        } catch (error) {
            throw new Error('Los datos ingresados no corresponden a una empresa');
        }
    },

    getEmpresas: async (): Promise<Empresa[]> => {
        try {
            const response = await fetch(process.env.URL_API + 'empresas', {
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

    updateEmpresa: async (empresa: Empresa, imagenes: Imagenes[], imagenesEliminadas: Imagenes[]) => {
        try {
            const response = await fetch(process.env.URL_API + 'empresa/update/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresa)
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
                        formData.append('cuit', empresa.cuit);

                        await fetch(process.env.URL_API + 'empresa/imagenes', {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(process.env.URL_API + 'empresa/imagen/' + imagen.id + '/delete', {
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

    updateEmpresaBorrado: async (empresa: Empresa) => {
        try {
            const response = await fetch(process.env.URL_API + 'empresa/update/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresa)
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