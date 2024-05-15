import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import { ArticuloMenuDTO } from '../types/Productos/ArticuloMenuDTO';
import { EnumTipoArticuloComida } from '../types/Productos/EnumTipoArticuloComida';
import { ImagenesProducto } from '../types/Productos/ImagenesProducto';
import { ImagenesProductoDTO } from '../types/Productos/ImagenesProductoDTO';
import { URL_API } from '../utils/global_variables/const';

export const MenuService = {

    getMenus: async (): Promise<ArticuloMenuDTO[]> => {
        const response = await fetch(URL_API + 'menus')

        return await response.json();
    },

    getMenusPorTipo: async (tipoComida: EnumTipoArticuloComida | null): Promise<ArticuloMenuDTO[]> => {
        const response = await fetch(URL_API + 'menu/tipo/' + tipoComida);

        return await response.json();
    },


    createMenu: async (menu: ArticuloMenu, imagenes: ImagenesProducto[]): Promise<string> => {
        try {
            const menuResponse = await fetch(URL_API + 'menu/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
            });

            let cargarImagenes = true;

            if (menuResponse.status === 302) { // 302 Found (Error que arroja si el menu ya existe)
                cargarImagenes = false;
                return 'Menu existente';
            }

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreMenu', menu.nombre);

                        await fetch(URL_API + 'menu/imagenes', {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));
            }
            return 'Articulo actualizado con éxito';

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateMenu: async (menu: ArticuloMenu, imagenes: ImagenesProducto[], imagenesEliminadas: ImagenesProductoDTO[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'menu/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
            })

            let cargarImagenes = true;


            if (response.status === 302) { // 302 Found (Error que arroja si el menu ya existe)
                cargarImagenes = false;
                return 'Menu existente';
            }

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes && (imagenes || imagenesEliminadas)) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreMenu', menu.nombre);

                        await fetch(URL_API + 'menu/imagenes', {
                            method: 'POST',
                            body: formData
                        });

                    }
                }));

                if (imagenesEliminadas) {
                    await Promise.all(imagenesEliminadas.map(async (imagen) => {
                        await fetch(URL_API + 'menu/imagen/' + imagen.id + '/delete', {
                            method: 'PUT',
                        });

                    }));
                }
            }
            return 'Articulo actualizado con éxito';

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    deleteMenu: async (nombre: string): Promise<string> => {
        try {
            const response = await fetch(URL_API + `menu/${nombre}/delete`, {
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