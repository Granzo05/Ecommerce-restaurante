import { useState } from 'react';
import { Stock } from '../../types/Stock';
import { StockService } from '../../services/StockService';
import { Ingrediente } from '../../types/Ingrediente';

interface EditarStockProps {
  stockOriginal: Stock;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockOriginal }) => {

  const [cantidad, setCantidad] = useState(0);
  const [medida, setMedida] = useState('');
  const [nombreIngrediente, setIngredienteNombre] = useState('');
  const [costoIngrediente, setCostoIngrediente] = useState(0);

  function editarStock() {
    const stock: Stock = stockOriginal;

    const ingrediente: Ingrediente = stockOriginal.ingrediente;
    ingrediente.nombre = nombreIngrediente;
    ingrediente.costo = costoIngrediente;

    stock.ingrediente = ingrediente;
    stock.cantidad = cantidad;
    stock.medida = medida;

    StockService.updateStock(stock);
  }

  return (
    <div id="miModal" className="modal">
      <div className="modal-content">
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.ingrediente.nombre} placeholder="Nombre del ingrediente" id="nombreStock" onChange={(e) => { setIngredienteNombre(e.target.value) }} />
        </label>
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.cantidad} placeholder="Cantidad del ingrediente" id="cantidadStock" onChange={(e) => { setCantidad(parseFloat(e.target.value)) }} />
        </label>
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.medida} placeholder="Medida del ingrediente" id="medidaStock" onChange={(e) => { setMedida(e.target.value) }} />
        </label>
        <br />
        <label>
          <i className='bx bx-lock'></i>
          <input type="text" value={stockOriginal.ingrediente.costo} placeholder="Costo del ingrediente" id="costoStock" onChange={(e) => { setCostoIngrediente(parseFloat(e.target.value)) }} />
        </label>
        <input type="button" value="editarStock" id="editarStock" onClick={editarStock} />
      </div>
    </div>
  )
}

export default EditarStock
