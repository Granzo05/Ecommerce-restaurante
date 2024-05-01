import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { Carrito } from '../types/Pedidos/Carrito';
import { CarritoService } from '../services/CarritoService';
import { useEffect, useState } from 'react';

const CarritoComponent = () => {
    const [carritoAbierto, setCarritoAbierto] = useState(false);

    const [carrito, setCarrito] = useState<Carrito | null>(null);

    useEffect(() => {
        const actualizarCarrito = async () => {
            try {
                const carritoActualizado = await CarritoService.getCarrito();
                setCarrito(carritoActualizado);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        actualizarCarrito();

        const intervalo = setInterval(actualizarCarrito, 500);

        return () => clearInterval(intervalo);
    }, []);

    function handleLimpiarCarrito() {
        CarritoService.limpiarCarrito();
        setCarritoAbierto(false);
        setCarrito(null);
    }

    async function eliminarProducto(menuNombre: string) {
        await CarritoService.borrarProducto(menuNombre)
    }

    function cargarCarrito() {
        const carritoString = localStorage.getItem('carrito');
        let carrito: Carrito = carritoString ? JSON.parse(carritoString) : new Carrito();
        setCarrito(carrito);
    }

    function abrirCarrito() {
        cargarCarrito();
        setCarritoAbierto(true)
    }

    function handleFinalizarPedido() {
        if (carrito) {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
        window.location.href = '/pago';
    }

    return (
        <div>
            <button onClick={() => abrirCarrito()} id='carrito' style={{ background: 'none', border: 'none', color: 'white', margin: '20px', position: 'relative' }}><ShoppingCartIcon style={{ display: 'block' }} /><label id='contador-carrito'>{carrito?.totalProductos}</label></button>
            <div className={`container-cart-products ${carritoAbierto ? '' : 'hidden-cart'}`}>
                <div className="container-cart-products">

                    <button id='carrito' style={{ background: 'none', border: 'none', color: 'black', margin: '50px', position: 'relative', marginTop: '20px', marginLeft: '5px' }}>
                        <ShoppingCartIcon style={{ display: 'block' }} />
                        <label id='contador-carrito'>{carrito?.totalProductos}</label>
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'black', marginLeft: '300px', padding: '15px' }} className='icon-close' onClick={() => setCarritoAbierto(false)}><CloseIcon /></button>
                    {carrito && (carrito.articuloMenu && carrito.articuloMenu.length === 0 || carrito.articuloVenta && carrito.articuloVenta.length === 0) && (
                        <div className="container-empty-cart">
                            <p>El carrito está vacío</p>
                        </div>
                    )}
                    {carrito && carrito.articuloMenu && carrito.articuloMenu.map((producto, index) => (
                        <div className="cart-product" key={index}>
                            <div className="info-cart-product">
                                <img src={producto.imagenes[0].ruta} alt="" />
                                <span className='cantidad-producto-carrito'>{carrito.articuloMenu[index].cantidad}</span>
                                <span className='titulo-producto-carrito'>{producto.nombre}</span>
                                <span className='precio-producto-carrito'>{producto.precioVenta * producto.cantidad}</span>
                                <span onClick={() => eliminarProducto(producto.nombre)}>X</span>
                            </div>
                        </div>
                    ))}

                    {carrito && carrito.articuloVenta && carrito.articuloVenta.map((producto, index) => (
                        <div className="cart-product" key={index}>
                            <div className="info-cart-product">
                                <img src={producto.imagenes[0].ruta} alt="" />
                                <span className='cantidad-producto-carrito'>{carrito.articuloVenta[index].cantidad}</span>
                                <span className='titulo-producto-carrito'>{producto.nombre}</span>
                                <span className='precio-producto-carrito'>{producto.precioVenta * producto.cantidad}</span>
                                <span onClick={() => eliminarProducto(producto.nombre)}>X</span>
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h3>Total:</h3>
                        <span className='total-pagar'>{carrito?.totalPrecio}</span>

                    </div>

                    <button onClick={handleLimpiarCarrito} className='finalizar-pedido-button'>Limpiar carrito</button>
                    <button onClick={handleFinalizarPedido} className='finalizar-pedido-button'>Finalizar pedido</button>
                </div>
            </div>
        </div>
    )

}

export default CarritoComponent;