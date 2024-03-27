import { Menu } from "../types/Menu";
export let menus: Menu[] = [];

export function cargarGrids(tipoComida: string) {
  return fetch('http://localhost:8080/menu/' + tipoComida)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      let gridContainer = document.getElementById("grid-container");
      
      if(data) {
        menus = data;
      }
      
      data.forEach((menu: Menu) => {
        let gridItem = document.createElement("div");
        gridItem.className = "grid-item";

        const imgElement = document.createElement("img");
        imgElement.src = "data:image/png;base64," + menu.imagen64;


        let nombreMenu = document.createElement("h2");
        nombreMenu.textContent = menu.name;

        let precioMenu = document.createElement("h2");
        precioMenu.textContent = (menu.price).toString();

        gridItem.appendChild(imgElement);
        gridItem.appendChild(nombreMenu);

        if (gridContainer) {
          gridContainer.appendChild(gridItem);
          gridContainer.id = (menu.id).toString();
        }
      });
    })
}

