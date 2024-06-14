import { ArticuloVenta } from '../types/Productos/ArticuloVenta';
import { Imagenes } from '../types/Productos/Imagenes';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const ArticuloVentaService = {

    getArticulos: async (): Promise<ArticuloVenta[]> => {
        try {
            const response = await fetch(URL_API + `articulos/${sucursalId}`)

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    getArticulosPorCategoriaAndIdSucursal: async (nombreCategoria: string, idSucursal: number): Promise<ArticuloVenta[]> => {
        try {
            const response = await fetch(URL_API + `articulos/tipo/${nombreCategoria}/${idSucursal}`);

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getArticulosPorNombreAndIdSucursal: async (nombre: string, idSucursal: number): Promise<ArticuloVenta[]> => {
        try {
            const response = await fetch(URL_API + `articulos/busqueda/${nombre}/${idSucursal}`);

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    createArticulo: async (articuloVenta: ArticuloVenta, imagenes: Imagenes[]): Promise<string> => {
        try {
            const menuResponse = await fetch(URL_API + 'articulo/create/' + sucursalId(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
            });

            let cargarImagenes = true;

            if (!menuResponse.ok) {
                cargarImagenes = false;
                throw new Error(await menuResponse.text());
            }

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreArticulo', articuloVenta.nombre);

                        await fetch(URL_API + 'articulo/imagenes/' + sucursalId(), {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));
            }

            return menuResponse.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateArticulo: async (articuloVenta: ArticuloVenta, imagenes: Imagenes[], imagenesEliminadas: Imagenes[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'articulo/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
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
                        formData.append('nombreArticulo', articuloVenta.nombre);

                        await fetch(URL_API + 'articulo/imagenes/' + sucursalId(), {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(URL_API + 'articulo/imagen/' + imagen.id + '/delete', {
                            method: 'PUT',
                        });
                    }));
                }
            }

            return response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    updateBorradoArticulo: async (articuloVenta: ArticuloVenta): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'articulo/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
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

}