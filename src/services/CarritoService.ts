import { ArticuloMenu } from "../types/Productos/ArticuloMenu";
import { Carrito } from "../types/Pedidos/Carrito";
import { Articulo } from "../types/Productos/Articulo";
import { ArticuloVenta } from "../types/Productos/ArticuloVenta";

export const CarritoService = {
    getCarrito: async (): Promise<Carrito> => {
        const carritoString = localStorage.getItem('carrito');
        const carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        return carrito;
    },

    agregarAlCarrito: async (articulo: Articulo, cantidad = 1) => {
        const nombre: string = articulo.nombre;

        // Busco el carrito existente
        let carrito = await CarritoService.getCarrito();

        let productoEnCarrito = false;

        if (articulo instanceof ArticuloMenu) {
            // Veo si el articulo entrante ya está cargado en el carrito
            carrito.articuloMenu.forEach((producto, index) => {
                if (producto.nombre === nombre) {
                    // Si existe, simplemente sumamos la cantidad
                    carrito.articuloMenu[index].cantidad += cantidad;
                    productoEnCarrito = true;
                }
            });

            if (!productoEnCarrito) {
                const articuloMenu = new ArticuloMenu();

                articuloMenu.cantidad = cantidad;

                carrito.totalProductos += cantidad;

                carrito.articuloMenu.push(articuloMenu);
            }

        } else if (articulo instanceof ArticuloVenta) {
            carrito.articuloVenta.forEach((producto, index) => {
                if (producto.nombre === nombre) {
                    // Si existe, simplemente sumamos la cantidad
                    carrito.articuloVenta[index].cantidad += cantidad;
                    productoEnCarrito = true;
                }
            });

            if (!productoEnCarrito) {
                const articuloVenta = new ArticuloVenta();

                articuloVenta.cantidad = cantidad;

                carrito.totalProductos += cantidad;

                carrito.articuloVenta.push(articuloVenta);
            }
        }

        CarritoService.actualizarCarrito(carrito);
    },

    actualizarCarrito: (carrito: Carrito) => {
        carrito.totalPrecio = 0;
        carrito.totalProductos = 0;

        carrito.articuloMenu.forEach(producto => {
            carrito.totalPrecio += producto.precioVenta * producto.cantidad;

            carrito.totalProductos += producto.cantidad;
        });

        carrito.articuloVenta.forEach(producto => {
            carrito.totalPrecio += producto.precioVenta * producto.cantidad;

            carrito.totalProductos += producto.cantidad;
        });

        localStorage.setItem('carrito', JSON.stringify(carrito));
    },

    limpiarCarrito: () => {
        localStorage.removeItem('carrito');
    },


    borrarProducto: async (menuNombre: string) => {
        let carrito = await CarritoService.getCarrito();

        // Encuentra el producto en el carrito
        let index = carrito.articuloMenu.findIndex((item) => item.nombre === menuNombre);

        if (index !== -1) {
            // Elimina el producto del carrito usando splice
            carrito.articuloMenu.splice(index, 1);
        } else {
            index = carrito.articuloVenta.findIndex((item) => item.nombre === menuNombre);

            carrito.articuloVenta.splice(index, 1);
        }

        CarritoService.actualizarCarrito(carrito);

    },


    finalizarCompra: () => {
        window.location.href = '/pago';
    }

}