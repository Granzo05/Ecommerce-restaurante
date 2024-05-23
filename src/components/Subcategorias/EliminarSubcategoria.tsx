import React from 'react';
import { Toaster, toast } from 'sonner'
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { SubcategoriaService } from '../../services/SubcategoriaService';

interface EliminarSubcategoriaProps {
  subcategoriaOriginal: Subcategoria;
  onCloseModal: () => void;

}

const EliminarSubcategoria: React.FC<EliminarSubcategoriaProps> = ({ subcategoriaOriginal, onCloseModal }) => {

  const onConfirm = () => {
    subcategoriaOriginal.borrado = 'SI';
    toast.promise(SubcategoriaService.updateSubcategoria(subcategoriaOriginal), {
      loading: 'Creando subcategoria...',
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

      <h2>¿Seguro que quieres eliminar la subcategoria?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarSubcategoria;
