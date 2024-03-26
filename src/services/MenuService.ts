import { Menu } from '../types/Menu';
import { URL_API } from '../utils/global_variables/const';

export const MenuService = {
    getMenus: async (): Promise<Menu[]> => {
        const response = await fetch(URL_API + 'menus')
        const data = await response.json();
        return data;
    },


    createMenu: async (menu: Menu): Promise<string> => {
        const response = await fetch(URL_API + 'menu/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify(menu)
        })

        const data = await response.json();

        return data;
    },

    updateMenu: async (menu: Menu): Promise<string> => {
        const response = await fetch(URL_API + '/menu/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menu)
        })

        const data = await response.json();

        return data;    
    },

    deleteMenu: async (idMenu: number): Promise<string> => {
        const response = await fetch(URL_API + `menu/${idMenu}/delete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json();

        return data;    
    },

}