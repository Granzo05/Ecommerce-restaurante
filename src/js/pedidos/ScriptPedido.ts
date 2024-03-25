import {Menu, Ingrediente} from '../types'

export function cargarMenu() {
    const urlActual = window.location.href;
    const idRestaurante: string = urlActual.split('/').pop() || '';

    fetch("http://localhost:8080/restaurante/" + idRestaurante + "/menu", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let contenedor = document.getElementById("container-items");

            data.forEach((menu: Menu) => {
                //Creamos el div que contiene cada menu
                let carta = document.createElement("div");
                carta.className = "card";

                // Creamos el frente de la tarjeta que va a contener la imagen y el nombre
                let frenteCarta = document.createElement("div");
                frenteCarta.className = "front";

                const imgElement = document.createElement("img");
                imgElement.src = "data:image/png;base64," + menu.imagen64;

                let nombreMenu = document.createElement("h2");
                nombreMenu.textContent = menu.nombre;
                nombreMenu.className = "nombre";

                let precioMenu = document.createElement("h2");
                precioMenu.textContent = "$" + menu.precio;
                precioMenu.className = "precio"

                let añadirBoton = document.createElement("button");
                añadirBoton.textContent = "Añadir al pedido";
                añadirBoton.onclick = function(event) {
                    const target = event.target as Element; 
                    if (target !== null) {
                        añadirAlCarrito();
                    }
                };              
                

                frenteCarta.appendChild(imgElement);
                frenteCarta.appendChild(nombreMenu);
                frenteCarta.appendChild(precioMenu);
                frenteCarta.appendChild(añadirBoton);

                // Creamos el dorso que va a contener los ingredientes y alguna descripcion quizas
                let dorsoCarta = document.createElement("div");
                dorsoCarta.className = "back";
                dorsoCarta.hidden = true;

                // Agregamos cada ingrediente
                let ingredientes = document.createElement("p");
                menu.ingredientes.forEach(ingrediente => {
                    ingredientes.textContent += "* " + ingrediente + "\n";
                });

                // Lo asignamos al dorso
                //dorsoCarta.appendChild(ingredientes);

                // Asignamos ambas caras a la tarjeta
                carta.appendChild(frenteCarta);
                //carta.appendChild(dorsoCarta);

                // Asignamos la carta completa al div
                if (contenedor) {
                    contenedor.appendChild(carta);
                }
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


// Agregar el otro script

export function añadirAlCarrito() {

}

export function finalizarPedido() {

}

//TODO LO DEL MODAL

export function abrirModal() {

}

export function cerrarModal() {

}

export function agregarMenu() {
    const nombreInput = document.getElementById("nombreMenu");
    const ingredientesInputs = document.querySelectorAll(".ingredienteMenu");
    const coccionInput = document.getElementById("coccionMenu");
    const tipoMenuSelect = document.getElementById("tipoMenu");
    const tipoMenuSeleccionado = tipoMenuSelect;
    const comensalesInput = document.getElementById("comensales");
    const precioInput = document.getElementById("precioMenu");
    const imagenInput = document.getElementById("imagenProducto");

    const ingredientes: Ingrediente[] = [];

    const formData = new FormData();

    nombreInput instanceof HTMLInputElement ? formData.append("tiempoCoccion", nombreInput.value) : formData.append("nombre", '');

    coccionInput instanceof HTMLInputElement ? formData.append("tiempoCoccion", coccionInput.value) : formData.append("tiempoCoccion", '0');

    tipoMenuSeleccionado instanceof HTMLInputElement ? formData.append("tipo", tipoMenuSeleccionado.value) : formData.append("tipo", '0');

    comensalesInput instanceof HTMLInputElement ? formData.append("comensales", comensalesInput.value) : formData.append("comensales", '0');

    precioInput instanceof HTMLInputElement ? formData.append("precio", precioInput.value) : formData.append("precio", '0');

    if (imagenInput instanceof HTMLInputElement && imagenInput.files && imagenInput.files.length > 0) {
        formData.append("file", imagenInput.files[0]);
    } else {
        formData.append("file", '0');
    }

    const urlActual = window.location.href;
    const idRestaurante: string = urlActual.split('/').pop() || '';
    idRestaurante ? formData.append("restauranteID", idRestaurante) : formData.append("restauranteID", '0');

    ingredientesInputs.forEach((input, index) => {
        var nombre: string = '';

        if (input instanceof HTMLInputElement) {
            nombre = input.value;
        }

        var cantidad: number = 0;

        if (
            ingredientesInputs[index].nextElementSibling instanceof HTMLInputElement &&
            ingredientesInputs[index].nextElementSibling !== null &&
            ingredientesInputs[index].nextElementSibling !== undefined
        ) {
            cantidad = Number(ingredientesInputs[index].nextElementSibling);
        }

        ingredientes.push({ nombre , cantidad });
    });

    formData.append("ingredientesInputs", JSON.stringify(ingredientes));

    fetch('http://localhost:8080/restaurante/menu', {
        method: 'POST',
        body: formData,
    })

        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el menu');
            }
            alert("Menu cargado con exito");
            cargarMenu();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function añadirCampoIngrediente() {
    let container = document.getElementById("ingrediente-container");

    let inputIngrediente = document.createElement("input");
    inputIngrediente.type = "text";
    inputIngrediente.placeholder = "Ingrediente";
    inputIngrediente.className = "ingredienteMenu";

    let inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.placeholder = "Cantidad necesaria";
    inputCantidad.className = "cantidadIngrediente";

    let br = document.createElement("br");

    if (container) {
        container.appendChild(inputIngrediente);
        container.appendChild(inputCantidad);
        container.appendChild(br);
    }
}

window.addEventListener("click", function (event) {
    var modal = document.getElementById("miModal");
    if (event.target == modal && modal) {
        modal.style.display = "none";
    }
});


const btnCarrito = document.querySelector('.container-icon');
const containerCarrito = document.querySelector('.container-productosCarrito');

if (btnCarrito && containerCarrito) {
    btnCarrito.addEventListener('click', e => {
        containerCarrito.classList.toggle('hidden-cart');
    });
}







