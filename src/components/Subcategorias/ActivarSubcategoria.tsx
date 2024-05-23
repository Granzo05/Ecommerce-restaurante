import React from 'react';
import { Toaster, toast } from 'sonner'
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { SubcategoriaService } from '../../services/SubcategoriaService';

interface ActivarSubcategoriaProps {
  subcategoriaOriginal: Subcategoria;
  onCloseModal: () => void;
}

const ActivarSubcategoria: React.FC<ActivarSubcategoriaProps> = ({ subcategoriaOriginal, onCloseModal }) => {
  const onConfirm = () => {
    subcategoriaOriginal.borrado = 'NO';
    toast.promise(SubcategoriaService.updateSubcategoria(subcategoriaOriginal), {
      loading: 'Activando subcategoria...',
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
      <h2>¿Seguro que quieres activar la categoria?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarSubcategoria;
