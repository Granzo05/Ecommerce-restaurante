import { useState } from 'react';
import { StockEntranteService } from '../../services/StockEntranteService';
import { toast, Toaster } from 'sonner';
import { StockEntrante } from '../../types/Stock/StockEntrante';

interface EditarStockProps {
  stockEntrante: StockEntrante;
  onCloseModal: () => void;
}

const EditarStock: React.FC<EditarStockProps> = ({ stockEntrante, onCloseModal }) => {
  const formatDate = (date: Date) => {
    const dia = date.getDate() + 1;
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();
    return new Date(año, mes - 1, dia);
  };

  const [fecha, setFecha] = useState(stockEntrante.fechaLlegada ? new Date(stockEntrante.fechaLlegada) : new Date());
  const [isLoading, setIsLoading] = useState(false);

  function editarStock() {
    const hoy = new Date();
    const fechaIngresada = new Date(fecha);

    const fechaObj = new Date(fecha);

    // Verificar que la fecha sea válida
    if (isNaN(fechaObj.getTime())) {
      toast.error("La fecha no es válida");
      return;
    }

    if (!fecha) {
      toast.error("Por favor, la fecha es necesaria");
      return;
    } else if (fechaIngresada <= hoy) {
      toast.error("Por favor, la fecha es necesaria y debe ser posterior a la fecha actual");
      return;
    }
    
    setIsLoading(true);

    stockEntrante.fechaLlegada = formatDate(new Date(fecha));
    toast.promise(StockEntranteService.updateStock(stockEntrante), {
      loading: 'Editando stock entrante...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
      finally: () => {
        setIsLoading(false);
      }
    });
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Editar stock entrante &mdash;</h2>
      <Toaster />
      <div className="inputBox">
        <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de entrada:</label>

        <input
          type="date"
          required={true}
          value={fecha.toISOString().substring(0, 10)}
          onChange={(e) => setFecha(new Date(e.target.value))}
        />
      </div>
      <button className='btn-accion-completar' onClick={editarStock} disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Editar stock entrante ✓'}
      </button>
    </div>
  )
}

export default EditarStock