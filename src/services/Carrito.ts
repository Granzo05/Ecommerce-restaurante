import { Carrito } from "../types/Carrito";
import { Menu } from "../types/Menu";

let total: number = 0;
let numeroDeItems = 0;

const carritoString = localStorage.getItem('carrito');
const carrito = carritoString ? JSON.parse(carritoString) : [];

actualizarCarrito();

export function agregarAlCarrito(menu: Menu) {
    let nombre: string = menu.nombre;
    let srcImage: string = menu.imagenes[0].ruta;
    let precio: number = menu.precio;

    let productoEnCarrito = carrito.find((item: Carrito) => item.menu[0].nombre === nombre);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1, srcImage });
    }
    actualizarCarrito();
}

// Esta función se encarga de volver a cargar el carrito cada vez que se cambia de página. 
export function actualizarCarrito() {
    total = 0;
    numeroDeItems = 0;

    carrito.forEach((item: Carrito, index: number) => {
        mostrarProductosAPagar(item, index);
        numeroDeItems = carrito.length;
    });

    // Actualizar el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Esta función se usa cuando se da a comprar en el html producto.
export function agregarAlCarritoProductoUnico(menu: Menu, cantidad: number) {
    const nombre = menu.nombre;
    const total = menu.precio * cantidad;

    let productoEnCarrito = carrito.find((item: Carrito) => item.menu[0].nombre === nombre);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ nombre, total, cantidad });
    }

    actualizarCarrito();
}

export function limpiarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Esta actualiza el precio cuando se agregan o restan productos en el pago
/*
export function actualizarPrecio(productoIndex: number) {
    let cantidadInput = document.getElementById('cantidadProductoPago' + productoIndex);
    let cantidad = parseInt(cantidadInput.value);

    if (!isNaN(cantidad) && cantidad > 0) {
        let precioProducto = parseFloat(carrito[productoIndex - 1].precio);

        let nuevoTotal = cantidad * (precioProducto - 1);
        total = parseFloat(0);
        carrito[productoIndex - 1].cantidad = cantidad;
        carrito[productoIndex - 1].total = parseFloat(nuevoTotal);
        actualizarCarrito();
        cargarPedidoPago();
    }
}
*/

export function borrarProducto(menuNombre: string) {
    // Encuentra el producto en el carrito
    const index = carrito.findIndex((item: Carrito) => item.menu[0].nombre === menuNombre);

    if (index !== -1) {
        // Elimina el producto del carrito usando splice
        carrito.splice(index, 1);

        // Actualiza el carrito
        actualizarCarrito();

        // Carga el pedido de pago
        cargarPedidoPago();
    } else {
        console.error("Producto no encontrado en el carrito.");
    }
}


// Muestra el carrito en el html pago para que el usuario vea e interactue con el carrito
export function cargarPedidoPago() {
    total = 0;
    if (carrito.length > 0) {
        carrito.forEach((item: Carrito, index: number) => {
            mostrarProductosAPagar(item, index);
        });
    }
}

/*
export function mostrarProductosAPagar(item: Carrito, index: number) {
    let divFila = document.createElement('div');
    divFila.classList.add('carrito-producto');

    let divImagen = document.createElement('div');
    divImagen.classList.add('imagen');

    let imagen = document.createElement('img');

    let nombre = quitarAcento(item.nombre);
    nombre = nombre.replace(' ', '');

    imagen.src = 'imagenes/' + nombre + '/' + nombre + '0';

    divImagen.appendChild(imagen);

    let nombreProducto = document.createElement('h1');
    nombreProducto.textContent = item.nombre;

    let cantidad = document.createElement('input');
    cantidad.type = 'number';
    cantidad.id = 'cantidadProductoPago' + (index + 1);
    cantidad.value = parseInt(item.cantidad);
    cantidad.min = 1;
    cantidad.classList.add('form-control');
    cantidad.addEventListener('change', () => actualizarPrecio(index + 1));

    let precio = document.createElement('h3');
    precio.textContent = (item.precio).toLocaleString('es-ES', { minimumFractionDigits: 2 });;

    total += item.precio * parseInt(cantidad.value);

    let divSeparador = document.createElement('p');
    divSeparador.textContent = '-';

    let cruz = document.createElement('p');
    cruz.textContent = 'X';
    cruz.onclick = export function () {
        borrarProducto(index + 1);
    }

    divFila.appendChild(cantidad);
    divFila.appendChild(divSeparador);
    divFila.appendChild(divImagen);
    divFila.appendChild(nombreProducto);
    divFila.appendChild(precio);
    divFila.appendChild(cruz);

    let br = document.createElement('br');

    contenedor.appendChild(divFila);
    contenedor.appendChild(br);
}
*/

export function finalizarCompra() {
    window.location.href = '/pago';
}
