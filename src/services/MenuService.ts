import { Menu } from '../types/Menu';
import { URL_API } from '../utils/global_variables/const';

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


    createMenu: async (menu: Menu, imagenes: File[]) => {
        try {
            /*
            // Primero cargar el menú
            const menuResponse = await fetch(URL_API + 'menu/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
            });

            if (!menuResponse.ok) {
                throw new Error(`Error al obtener datos (${menuResponse.status}): ${menuResponse.statusText}`);
            }
            */
            console.log(imagenes)

            imagenes.forEach(async (imagen) => {
                if (imagen) {
                    // Crear objeto FormData para las imágenes
                    const formData = new FormData();

                    formData.append('file', imagen);

                    const menuResponse = await fetch(URL_API + 'menu/imagenes', {
                        method: 'POST',
                        body: formData
                    });

                    if (!menuResponse.ok) {
                        throw new Error(`Error al obtener datos (${menuResponse.status}): ${menuResponse.statusText}`);
                    }

                }
            });

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },



    updateMenu: async (menu: Menu): Promise<string> => {
        try {
            const response = await fetch(URL_API + 'menu/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
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