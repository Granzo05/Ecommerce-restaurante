import { ArticuloMenu } from '../types/Productos/ArticuloMenu';
import { ImagenesProducto } from '../types/Productos/ImagenesProducto';
import { URL_API } from '../utils/global_variables/const';

export const MenuService = {

    getMenus: async (): Promise<ArticuloMenu[]> => {
        const response = await fetch(URL_API + 'menus')

        return await response.json();
    },

    getMenusPorTipo: async (tipoComida: string): Promise<ArticuloMenu[]> => {
        const response = await fetch(URL_API + 'menu/tipo/' + tipoComida);

        let menus = await response.json();

        menus.forEach((menu: ArticuloMenu) => {
            menu.imagenes.forEach((imagen, index) => {
                imagen.ruta = URL_API + menu.nombre.replace(/\s+/g, '') + '/' + menu.imagenes[index].nombre;
            });
        });

        return menus;
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
                return 'ArticuloMenu existente';
            }

            let imagenCargadaExitosamente = false;

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreMenu', menu.nombre);

                        const imagenResponse = await fetch(URL_API + 'menu/imagenes', {
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
                return 'ArticuloMenu creado con éxito';
            } else {
                return 'Ocurrió un error con la imagen';
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateMenu: async (menu: ArticuloMenu, imagenes: ImagenesProducto[]): Promise<string> => {
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
                return 'ArticuloMenu existente';
            }

            let imagenCargadaExitosamente = false;

            // Cargar imágenes solo si se debe hacer
            if (cargarImagenes) {
                await Promise.all(imagenes.map(async (imagen) => {
                    if (imagen.file) {
                        // Crear objeto FormData para las imágenes
                        const formData = new FormData();
                        formData.append('file', imagen.file);
                        formData.append('nombreMenu', menu.nombre);

                        const imagenResponse = await fetch(URL_API + 'menu/imagenes', {
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

            if (imagenCargadaExitosamente) {
                return 'ArticuloMenu creado con éxito';
            } else {
                return 'Ocurrió un error';
            }


        } catch (error) {
            console.error('Error:', error);
            throw error;
        }

    },

    deleteMenu: async (id: number): Promise<string> => {
        try {
            const response = await fetch(URL_API + `menu/${id}/delete`, {
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