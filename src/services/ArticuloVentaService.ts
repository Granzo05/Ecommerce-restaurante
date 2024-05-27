import { ArticuloVenta } from '../types/Productos/ArticuloVenta';
import { ImagenesProducto } from '../types/Productos/Imagenes';
import { ImagenesProductoDTO } from '../types/Productos/ImagenesProductoDTO';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const ArticuloVentaService = {

    getArticulos: async (): Promise<ArticuloVenta[]> => {
        const response = await fetch(URL_API + `articulos/${sucursalId}`)

        return await response.json();
    },

    getArticulosPorCategoria: async (nombreCategoria: string): Promise<ArticuloVenta[]> => {
        const response = await fetch(URL_API + `articulo/tipo/${nombreCategoria}/${sucursalId}`);

        return await response.json();
    },


    createArticulo: async (articuloVenta: ArticuloVenta, imagenes: ImagenesProducto[]): Promise<string> => {
        try {
            const menuResponse = await fetch(URL_API + 'articulo/create/' + sucursalId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
            });

            let cargarImagenes = true;

            if (menuResponse.status === 302) { // 302 Found (Error que arroja si el articuloVenta ya existe)
                cargarImagenes = false;
                return menuResponse.text();
            }

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreArticulo', articuloVenta.nombre);

                        await fetch(URL_API + 'articulo/imagenes', {
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

    updateArticulo: async (articuloVenta: ArticuloVenta, imagenes: ImagenesProducto[], imagenesEliminadas: ImagenesProductoDTO[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'articulo/update/' + sucursalId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
            })

            let cargarImagenes = true;

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes && (imagenes || imagenesEliminadas)) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreArticulo', articuloVenta.nombre);

                        await fetch(URL_API + 'articulo/imagenes', {
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
            const response = await fetch(URL_API + 'articulo/update/' + sucursalId, {
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