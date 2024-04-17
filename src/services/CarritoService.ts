import { Menu } from "../types/Menu";
import { Carrito } from "../types/Carrito";
import { Productos } from "../types/Productos";

export const CarritoService = {
    getCarrito: async (): Promise<Carrito> => {
        const carritoString = localStorage.getItem('carrito');
        const carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        return carrito;
    },

    agregarAlCarrito: async (menu: Menu, cantidad = 1) => {
        const nombre: string = menu.nombre;

        // Busco el carrito existente
        let carrito = await CarritoService.getCarrito();

        let productoEnCarrito = false;

        // Veo si el menu entrante ya está cargado en el carrito
        carrito.productos.forEach((producto, index) => {
            if (producto.menu.nombre === nombre) {
                // Si existe, simplemente sumamos la cantidad
                carrito.productos[index].cantidad += cantidad;
                productoEnCarrito = true;
            }
        });

        // Si no está cargado entonces lo agrego
        if (!productoEnCarrito) {
            let producto = new Productos();

            producto.cantidad = cantidad;
            producto.menu = menu;

            carrito.subTotal = producto.menu.precio * producto.cantidad;

            carrito.totalProductos += cantidad;

            carrito.totalPrecio += carrito.subTotal;

            carrito.productos.push(producto);
        }

        CarritoService.actualizarCarrito(carrito);
    },

    actualizarCarrito: (carrito: Carrito) => {
        carrito.totalPrecio = 0;
        carrito.totalProductos = 0;

        carrito.productos.forEach(producto => {
            carrito.totalPrecio += producto.menu.precio * producto.cantidad;
            
            carrito.totalProductos += producto.cantidad;
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
    },

    limpiarCarrito: () => {
        localStorage.removeItem('carrito');
    },

    // Esta actualiza el precio cuando se agregan o restan productos en el pago

    actualizarPrecio: async (productoIndex: number) => {
        let carrito = await CarritoService.getCarrito();

        if (!isNaN(carrito.productos[productoIndex - 1].cantidad) && carrito.productos[productoIndex - 1].cantidad > 0) {
            let precioProducto = carrito.productos[productoIndex - 1].menu.precio;
            let nuevoTotal = carrito.productos[productoIndex - 1].cantidad * (precioProducto - 1);

            carrito.totalPrecio = nuevoTotal;

            CarritoService.actualizarCarrito(carrito);
        }
    },

    borrarProducto: async (menuNombre: string) => {
        let carrito = await CarritoService.getCarrito();

        // Encuentra el producto en el carrito
        const index = carrito.productos.findIndex((item) => item.menu.nombre === menuNombre);

        if (index !== -1) {
            // Elimina el producto del carrito usando splice
            carrito.productos.splice(index, 1);

            // Actualiza el carrito
            CarritoService.actualizarCarrito(carrito);
        } else {
            console.error("Producto no encontrado en el carrito.");
        }
    },


    finalizarCompra: () => {
        window.location.href = '/pago';
    }

}