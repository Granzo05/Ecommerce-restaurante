import { Carrito } from "../types/Pedidos/Carrito";
import { ArticuloVenta } from "../types/Productos/ArticuloVenta";
import { ArticuloMenuDTO } from "../types/Productos/ArticuloMenuDTO";

export const CarritoService = {
    getCarrito: async (): Promise<Carrito> => {
        const carritoString = localStorage.getItem('carrito');
        const carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();

        return carrito;
    },

    agregarAlCarrito: async (articuloMenu: ArticuloMenuDTO | null, articuloVenta: ArticuloVenta | null, cantidad = 1) => {
        // Busco el carrito existente
        let carrito = await CarritoService.getCarrito();

        let productoEnCarrito = false;

        if (articuloMenu) {
            // Veo si el articulo entrante ya está cargado en el carrito
            carrito.articuloMenu.forEach((producto, index) => {
                if (producto.nombre === articuloMenu.nombre) {
                    // Si existe, simplemente sumamos la cantidad
                    carrito.articuloMenu[index].cantidad += cantidad;
                    productoEnCarrito = true;
                }
            });

            if (!productoEnCarrito) {
                articuloMenu.cantidad = cantidad;

                carrito.totalProductos += cantidad;

                carrito.articuloMenu.push(articuloMenu);
            }
        } else if (articuloVenta) {
            carrito.articuloVenta.forEach((producto, index) => {
                if (producto.nombre === articuloVenta.nombre) {
                    // Si existe, simplemente sumamos la cantidad
                    carrito.articuloVenta[index].cantidad += cantidad;
                    productoEnCarrito = true;
                }
            });

            if (!productoEnCarrito) {

                articuloVenta.cantidad = cantidad;

                carrito.totalProductos += cantidad;

                carrito.articuloVenta.push(articuloVenta);
            }
        }

        console.log(carrito)
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