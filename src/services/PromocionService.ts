import { Imagenes } from '../types/Productos/Imagenes';
import { Promocion } from '../types/Productos/Promocion';
import { sucursalId } from '../utils/global_variables/const';

export const PromocionService = {
    createPromocion: async (promocion: Promocion, imagenes: Imagenes[]): Promise<string> => {
        try {
            const response = await fetch(process.env.URL_API + 'promocion/create/' + sucursalId(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promocion)
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
                        formData.append('nombrePromocion', promocion.nombre);

                        await fetch(process.env.URL_API + 'promocion/imagenes/' + sucursalId(), {
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

    getPromociones: async (): Promise<Promocion[]> => {
        try {
            const response = await fetch(process.env.URL_API + 'promociones/' + sucursalId(), {
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

    updatePromocion: async (promocion: Promocion, imagenes: Imagenes[], imagenesEliminadas: Imagenes[]) => {
        try {
            const response = await fetch(process.env.URL_API + 'promocion/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promocion)
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
                        formData.append('nombrePromocion', promocion.nombre);

                        await fetch(process.env.URL_API + 'promocion/imagenes/' + sucursalId(), {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(process.env.URL_API + 'promocion/imagen/' + imagen.id + '/delete', {
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

    updatePromocionBorrado: async (promocion: Promocion) => {
        console.log(promocion)
        try {
            const response = await fetch(process.env.URL_API + 'promocion/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promocion)
            })

            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}