import { Menu } from '../types/Menu';
import { menus } from './menusPorTipoComida';

export function cargarMenu(idMenu: number) {
    // Busco el contenedor
    let gridContainer = document.getElementById("grid-container");

    // Traigo el array de menus del fetch que hice al cargar todos por el tipo, para evitar hacer otra llamada más.
    menus.forEach((menu: Menu) => {
        // Busco el menu que tenga el id que recibo de hacer click en un menu
        if (menu.id == idMenu) {
            // Una vez que lo encuentro cargo todos los datos en la pagina
            let gridItem = document.createElement("div");
            gridItem.className = "grid-item";

            const imgElement = document.createElement("img");
            imgElement.src = "data:image/png;base64," + menu.imagen64;

            let nombreMenu = document.createElement("h2");
            nombreMenu.textContent = menu.name;

            let precioMenu = document.createElement("h2");
            precioMenu.textContent = `$${(menu.price).toString()}`;

            let descripcion = document.createElement("h2");
            descripcion.textContent = `Descripcion: ${menu.description}`;

            let comensales = document.createElement("h2");
            comensales.textContent = `Comensales ${(menu.diners).toString()}`;

            let ingredientes = document.createElement("h2");
            ingredientes.textContent = 'Ingredientes:';

            menu.ingredients.forEach(ingrediente => {
                let listIngredientes = document.createElement('p');
                listIngredientes.textContent = ` * ${ingrediente}`

                ingredientes.appendChild(listIngredientes);
            });

            let tiempoCoccion = document.createElement("h2");
            tiempoCoccion.textContent = `Tiempo de cocción: ${menu.coockingTime}`;

            gridItem.appendChild(imgElement);
            gridItem.appendChild(nombreMenu);

            if (gridContainer) {
                gridContainer.appendChild(gridItem);
                gridContainer.id = (menu.id).toString();
            }
        }

    });
}