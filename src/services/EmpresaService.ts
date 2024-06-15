import { Imagenes } from '../types/Productos/Imagenes';
import { Empresa } from '../types/Restaurante/Empresa';
import { getBaseUrl, limpiarCredenciales, URL_API } from '../utils/global_variables/const';

export const EmpresaService = {
    createEmpresa: async (empresa: Empresa, imagenes: Imagenes[]): Promise<string> => {
        const response = await fetch(URL_API + 'empresa/create', {
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
            await Promise.all(imagenes.map(async (imagen: Imagenes) => {
                if (imagen.file) {
                    // Crear objeto FormData para las imágenes
                    const formData = new FormData();
                    formData.append('file', imagen.file);
                    formData.append('razonSocialEmpresa', empresa.razonSocial);

                    const responseImagenes = await fetch(URL_API + 'empresa/imagenes/', {
                        method: 'POST',
                        body: formData
                    });

                    if (!responseImagenes.ok) {
                        throw new Error(await response.text());
                    }
                }
            }));
        }

        return await response.text();
    },

    getEmpresa: async (email: string, contraseña: string) => {
        try {
            const response = await fetch(URL_API + 'empresa/login/' + email + '/' + contraseña, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const data = await response.json();

            if (data.id === null) {
                throw new Error('Credenciales inválidas');
            } else {
                let restaurante = {
                    id: data.id,
                    razonSocial: data.razonSocial
                }

                limpiarCredenciales();

                localStorage.setItem('empresa', JSON.stringify(restaurante));
                
                window.location.href = getBaseUrl() + '/empresa'
            }
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Credenciales inválidas');
        }
    },



    getEmpresas: async (): Promise<Empresa[]> => {
        try {
            const response = await fetch(URL_API + 'empresas', {
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
            const response = await fetch(URL_API + 'empresa/update', {
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
                        formData.append('razonSocialEmpresa', empresa.razonSocial);

                        await fetch(URL_API + 'empresa/imagenes', {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(URL_API + 'empresa/imagen/' + imagen.id + '/delete', {
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
            const response = await fetch(URL_API + 'empresa/update', {
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