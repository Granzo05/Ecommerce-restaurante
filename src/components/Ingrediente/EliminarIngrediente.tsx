import React from 'react';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { IngredienteService } from '../../services/IngredienteService';
import { Toaster, toast } from 'sonner'

interface EliminarIngredienteProps {
  ingredienteOriginal: Ingrediente;
  onCloseModal: () => void;

}

const EliminarIngrediente: React.FC<EliminarIngredienteProps> = ({ ingredienteOriginal, onCloseModal }) => {

  const onConfirm = () => {
    toast.promise(IngredienteService.deleteIngrediente(ingredienteOriginal.id), {
      loading: 'Creando Ingrediente...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  const onCancel = () => {
    onCloseModal();
  };

  return (
    <div className="modal-info">
      <Toaster />
      <p>¿Seguro que quieres eliminar el ingrediente?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarIngrediente;
