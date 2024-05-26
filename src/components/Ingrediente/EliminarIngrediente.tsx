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
    ingredienteOriginal.borrado = 'SI';
    toast.promise(IngredienteService.deleteIngrediente(ingredienteOriginal.id), {
      loading: 'Eliminando Ingrediente...',
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

      <h2>¿Seguro que quieres eliminar el ingrediente?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarIngrediente;
