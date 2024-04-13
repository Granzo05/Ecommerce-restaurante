import { Menu } from '../types/Menu';
import { URL_API } from '../utils/global_variables/const';

type Imagen = {
    index: number;
    file: File | null;
};

export const MenuService = {

    getMenus: async (): Promise<Menu[]> => {
        const response = await fetch(URL_API + 'menus')
        const data = await response.json();
        return data;
    },

    getMenusPorTipo: async (tipoComida: string): Promise<Menu[]> => {
        const response = await fetch(URL_API + 'menus/' + tipoComida);
        const data = await response.json();
        return data;
    },


    createMenu: async (menu: Menu, imagenes: Imagen[]): Promise<string> => {
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
                return 'Menu creado con éxito';
            } else {
                return 'Ocurrió un error';
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    updateMenu: async (menu: Menu, imagenes: Imagen[]): Promise<string> => {
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
                return 'Menu creado con éxito';
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