import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Promocion } from '../../types/Productos/Promocion';
import { PromocionService } from '../../services/PromocionService';

interface EditarStockProps {
  promocion: Promocion;
}

const EditarStock: React.FC<EditarStockProps> = ({ promocion }) => {
  const formatDate = (date: Date) => {
    const dia = date.getDate() + 1;
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();
    return new Date(año, mes - 1, dia);
  };

  const [fechaDesde, setFechaDesde] = useState(promocion.fechaDesde ? new Date(promocion.fechaDesde) : new Date());
  const [fechaHasta, setFechaHasta] = useState(promocion.fechaHasta ? new Date(promocion.fechaHasta) : new Date());

  function editarStock() {
    if (!fechaDesde) {
      toast.info("Por favor, coloque una fecha de inicio");
      return;
    } else if (!fechaHasta) {
      toast.info("Por favor, coloque una fecha de fin");
      return;
    }

    promocion.borrado = 'NO';

    promocion.fechaDesde = formatDate(new Date(fechaDesde));
    promocion.fechaHasta = formatDate(new Date(fechaHasta));

    toast.promise(PromocionService.updatePromocion(promocion), {
      loading: 'Editando promoción...',
      success: (message) => {
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <Toaster />
      <div className="inputBox">
        <input
          type="date"
          required={true}
          value={fechaDesde.toISOString().substring(0, 10)}
          onChange={(e) => setFechaDesde(new Date(e.target.value))}
        />
        <span>Fecha de inicio</span>
      </div>
      <div className="inputBox">
        <input
          type="date"
          required={true}
          value={fechaHasta.toISOString().substring(0, 10)}
          onChange={(e) => setFechaHasta(new Date(e.target.value))}
        />
        <span>Fecha de finalización</span>
      </div>
      <button type="button" onClick={editarStock}>Editar stock entrante</button>
    </div>
  )
}

export default EditarStock