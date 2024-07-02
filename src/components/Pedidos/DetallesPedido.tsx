import '../../styles/modalFlotante.css';
import { Pedido } from '../../types/Pedidos/Pedido';

interface Props {
  pedido: Pedido;
}

export const DetallesPedido: React.FC<Props> = ({ pedido }) => {

  return (
    <div id="modal-container">
      <div key={pedido.id} className="detalle-item">
        <h2>&mdash; Detalle del pedido &mdash;</h2>
        <div className="cards-container">
          {pedido.detallesPedido?.map(detalle => (
            <div className="card" key={detalle.id}>
              {detalle.promocion?.nombre && (
                <>
                  <div className="card-header">
                    <h2 className="detalle-title"><strong>Promoción: {detalle.promocion?.nombre}</strong></h2>
                  </div>
                  <div className="card-body">
                    {detalle.promocion.detallesPromocion?.map(dp => (
                      <div key={dp.id} className="detalle-promocion">
                        {dp.articuloVenta?.nombre && (
                          <div className="detalle-articulo">
                            <h5 className="detalle-title"><strong>Artículo promoción: </strong>{dp.articuloVenta.nombre} - {dp.articuloVenta.cantidadMedida} {dp.articuloVenta.medida.nombre}</h5>
                            <p className='detalle-info'><strong>Cantidad artículo: </strong> {dp.cantidad}</p>
                            <hr />
                          </div>
                        )}
                        {dp.articuloMenu?.nombre && (
                          <div className="detalle-menu">
                            <h5 className="detalle-title"><strong>Menú promoción: </strong>{dp.articuloMenu.nombre}</h5>
                            <h5 className="detalle-title"><strong>Ingredientes:</strong></h5>
                            {dp.articuloMenu.ingredientesMenu?.map(ingrediente => (
                              <div key={ingrediente.ingrediente.nombre}>
                                <p className="detalle-info">{ingrediente.ingrediente?.nombre} - {ingrediente.cantidad} {ingrediente.medida.nombre}</p>
                              </div>
                            ))}
                            <p className='detalle-info'><strong>Cantidad menú: </strong> {dp.cantidad}</p>
                            <hr />
                          </div>
                        )}
                      </div>
                    ))}
                    <p className='detalle-info'><strong>Cantidad pedida promoción: </strong> {detalle.cantidad}</p>
                  </div>
                </>
              )}

              {detalle.articuloVenta?.nombre && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="detalle-title"><strong>Artículo: {detalle.articuloVenta?.nombre} - {detalle.articuloVenta?.cantidadMedida} {detalle.articuloVenta?.medida.nombre} </strong></h2>
                  </div>
                  <div className="card-body">
                    <p className='detalle-info'><strong>Cantidad: </strong> {detalle.cantidad}</p>
                  </div>
                </div>
              )}

              {detalle.articuloMenu?.nombre && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="detalle-title"><strong>Menú: {detalle.articuloMenu?.nombre}</strong></h2>
                  </div>
                  <div className="card-body">
                    <h4 className="detalle-title"><strong>Ingredientes:</strong></h4>
                    {detalle.articuloMenu?.ingredientesMenu?.map(ingrediente => (
                      <div key={ingrediente.ingrediente.nombre}>
                        <p className="detalle-info">{ingrediente.ingrediente?.nombre} - {ingrediente.cantidad} {ingrediente.medida.nombre}</p>
                      </div>
                    ))}
                    <p className="detalle-info"><strong>Tiempo de cocción:</strong> {detalle.articuloMenu?.tiempoCoccion} minutos</p>
                    <p className='detalle-info'><strong>Cantidad menú: </strong> {detalle.cantidad}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default DetallesPedido;
