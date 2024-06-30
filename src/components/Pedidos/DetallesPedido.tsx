import '../../styles/modalFlotante.css';
import { Pedido } from '../../types/Pedidos/Pedido';

interface Props {
  pedido: Pedido;
}

export const DetallesPedido: React.FC<Props> = ({ pedido }) => {

  console.log(pedido.detallesPedido)

  return (
    <div id="modal-container">
      <div key={pedido.id} className="detalle-item">
        <ul>
          {pedido.detallesPedido?.map(detalle => (
            <li key={detalle.id}>
              {detalle.promocion?.nombre && (
                <>
                  <h2 className="detalle-title"><strong>Promoción: {detalle.promocion?.nombre}</strong></h2>
                  <hr />
                  {detalle.promocion.detallesPromocion?.map(dp => (
                    <div key={dp.id}>
                      {dp.articuloVenta?.nombre && (
                        <>
                          <h2 className="detalle-title"><strong>Artículo: {dp.articuloVenta.nombre} - {dp.articuloVenta.cantidadMedida} {dp.articuloVenta.medida.nombre}</strong></h2>
                          <p className='detalle-info'><strong>Cantidad: </strong> {dp.articuloVenta.cantidad}</p>
                        </>
                      )}
                      {dp.articuloMenu?.nombre && (
                        <>
                          <h2 className="detalle-title"><strong>Menú: {dp.articuloMenu.nombre}</strong></h2>
                          <h2 className="detalle-title"><strong>Ingredientes:</strong></h2>
                          {dp.articuloMenu.ingredientesMenu?.map(ingrediente => (
                            <div key={ingrediente.ingrediente.nombre}>
                              <li className="detalle-info">{ingrediente.ingrediente?.nombre}</li>
                              <li className="detalle-info">{ingrediente.cantidad} {ingrediente.medida.nombre}</li>
                            </div>
                          ))}
                          <p className="detalle-info"><strong>Tiempo de cocción:</strong> {dp.articuloMenu.tiempoCoccion} minutos</p>
                        </>
                      )}
                    </div>
                  ))}
                  <p className='detalle-info'><strong>Cantidad: </strong> {detalle.promocion?.cantidad}</p>
                </>
              )}

              {detalle.articuloVenta?.nombre && (
                <>
                  <h2 className="detalle-title"><strong>Artículo: {detalle.articuloVenta?.nombre} - {detalle.articuloVenta?.cantidadMedida} {detalle.articuloVenta?.medida.nombre} </strong></h2>
                  <p className='detalle-info'><strong>Cantidad: </strong> {detalle.cantidad}</p>
                </>
              )}

              {detalle.articuloMenu?.nombre && (
                <>
                  <h2 className="detalle-title"><strong>Menú: {detalle.articuloMenu?.nombre}</strong></h2>
                  <h2 className="detalle-title"><strong>Ingredientes:</strong></h2>
                  {detalle.articuloMenu?.ingredientesMenu?.map(ingrediente => (
                    <div key={ingrediente.ingrediente.nombre}>
                      <li className="detalle-info">{ingrediente.ingrediente?.nombre}</li>
                      <li className="detalle-info">{ingrediente.cantidad} {ingrediente.medida.nombre}</li>
                    </div>
                  ))}
                  <p className="detalle-info"><strong>Tiempo de cocción:</strong> {detalle.articuloMenu?.tiempoCoccion} minutos</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

}

export default DetallesPedido;
