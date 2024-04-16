import { Carrito } from "../types/Carrito";
import { Menu } from "../types/Menu";

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

export function actualizarPrecio(productoIndex: number) {
    if (!isNaN(carrito.cantidad) && carrito.cantidad > 0) {
        let precioProducto = parseFloat(carrito[productoIndex - 1].precio);

        let nuevoTotal = carrito.cantidad * (precioProducto - 1);

        carrito[productoIndex - 1].cantidad = carrito.cantidad;
        carrito[productoIndex - 1].total = nuevoTotal;

        actualizarCarrito();
    }
}


export function borrarProducto(menuNombre: string) {
    // Encuentra el producto en el carrito
    const index = carrito.findIndex((item: Carrito) => item.menu[0].nombre === menuNombre);

    if (index !== -1) {
        // Elimina el producto del carrito usando splice
        carrito.splice(index, 1);

        // Actualiza el carrito
        actualizarCarrito();
    } else {
        console.error("Producto no encontrado en el carrito.");
    }
}


export function finalizarCompra() {
    window.location.href = '/pago';
}
