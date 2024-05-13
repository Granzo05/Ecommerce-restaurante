import { ArticuloVenta } from '../types/Productos/ArticuloVenta';
import { EnumTipoArticuloVenta } from '../types/Productos/EnumTipoArticuloVenta';
import { ImagenesProducto } from '../types/Productos/ImagenesProducto';
import { ImagenesProductoDTO } from '../types/Productos/ImagenesProductoDTO';
import { URL_API } from '../utils/global_variables/const';

export const ArticuloVentaService = {

    getArticulos: async (): Promise<ArticuloVenta[]> => {
        const response = await fetch(URL_API + 'articulos')

        return await response.json();
    },

    getArticulosPorTipo: async (tipoArticulo: EnumTipoArticuloVenta): Promise<ArticuloVenta[]> => {
        const response = await fetch(URL_API + 'articulo/tipo/' + tipoArticulo);

        return await response.json();
    },


    createArticulo: async (articuloVenta: ArticuloVenta, imagenes: ImagenesProducto[]): Promise<string> => {
        try {
            const menuResponse = await fetch(URL_API + 'articulo/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
            });

            let cargarImagenes = true;

            if (menuResponse.status === 302) { // 302 Found (Error que arroja si el articuloVenta ya existe)
                cargarImagenes = false;
                return 'ArticuloVenta existente';
            }

            let imagenCargadaExitosamente = false;

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreArticulo', articuloVenta.nombre);

                        const imagenResponse = await fetch(URL_API + 'articulo/imagenes', {
                            method: 'POST',
                            body: formData
                        });

                        if (imagenResponse.status === 404 || imagenResponse.status === 400) {
                            imagenCargadaExitosamente = false
                        } else {
                            imagenCargadaExitosamente = true;
                        }
                    }
                }));
            }

            if (imagenCargadaExitosamente && imagenes.length > 0) {
                return 'ArticuloVenta creado con éxito';
            } else {
                return 'ArticuloVenta creado con éxito pero sin imágen asociada';
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateArticulo: async (articuloVenta: ArticuloVenta, imagenes: ImagenesProducto[], imagenesEliminadas: ImagenesProductoDTO[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'articulo/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloVenta)
            })

            let cargarImagenes = true;

            if (response.status === 302) { // 302 Found (Error que arroja si el articuloVenta ya existe)
                cargarImagenes = false;
                return 'ArticuloVenta existente';
            }

            let imagenCargadaExitosamente = false;

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes && (imagenes || imagenesEliminadas)) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreArticulo', articuloVenta.nombre);

                        const imagenResponse = await fetch(URL_API + 'articulo/imagenes', {
                            method: 'POST',
                            body: formData
                        });

                        if (imagenResponse.status === 404 || imagenResponse.status === 400) {
                            imagenCargadaExitosamente = false
                        } else {
                            imagenCargadaExitosamente = true;
                        }
                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        const imagenResponse = await fetch(URL_API + 'articulo/imagen/' + imagen.id + '/delete', {
                            method: 'PUT',
                        });

                        if (imagenResponse.status === 404 || imagenResponse.status === 400) {
                            imagenCargadaExitosamente = false
                        } else {
                            imagenCargadaExitosamente = true;
                        }
                    }));
                }
            }

            return 'Articulo actualizado con éxito';

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    deleteArticulo: async (id: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + `articulo/${id}/delete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
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