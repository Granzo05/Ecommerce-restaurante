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

    createMenu: async (menu: Menu): Promise<string> => {
        const response = await fetch(URL_API + 'menu/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify(menu)
        })

        return await response.text();

    },

    updateMenu: async (menu: Menu): Promise<string> => {
        const response = await fetch(URL_API + 'menu/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menu)
        })
        
        return await response.text();

    },

    deleteMenu: async (nombre: string): Promise<string> => {
        const response = await fetch(URL_API + `menu/${nombre}/delete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return await response.text();
    },

}