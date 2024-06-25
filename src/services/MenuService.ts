import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import { Imagenes } from '../types/Productos/Imagenes';
import { sucursalId, URL_API } from '../utils/global_variables/const';

export const MenuService = {

    getMenus: async (): Promise<ArticuloMenu[]> => {
        try {
            const response = await fetch(URL_API + 'menus/' + sucursalId())

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    getMenusNoBorrados: async (): Promise<ArticuloMenu[]> => {
        try {
            const response = await fetch(URL_API + 'menus/disponibles/' + sucursalId())

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    getMenusPorTipoAndIdSucursal: async (tipoComida: string, idSucursal: number): Promise<ArticuloMenu[]> => {
        try {
            const response = await fetch(URL_API + 'menu/tipo/' + tipoComida + '/' + idSucursal);

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    getMenusPorNombreAndIdSucursal: async (nombre: string, idSucursal: number): Promise<ArticuloMenu[]> => {
        try {
            const response = await fetch(URL_API + 'menu/busqueda/' + nombre + '/' + idSucursal);

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    createMenu: async (menu: ArticuloMenu, imagenes: Imagenes[]): Promise<string> => {
        try {
            const menuResponse = await fetch(URL_API + 'menu/create/' + sucursalId(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
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
                        formData.append('nombreMenu', menu.nombre);

                        await fetch(URL_API + 'menu/imagenes/' + sucursalId(), {
                            method: 'POST',
                            body: formData
                        });
                    }
                }));
            }


            return 'Menú creado con éxito';

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateMenu: async (menu: ArticuloMenu, imagenes: Imagenes[], imagenesEliminadas: Imagenes[]): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'menu/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
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
                        formData.append('nombreMenu', menu.nombre);

                        await fetch(URL_API + 'menu/imagenes/' + sucursalId(), {
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

    updateBorradoMenu: async (menu: ArticuloMenu): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'menu/update/' + sucursalId(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
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