import React from 'react';
import { CategoriaService } from '../../services/CategoriaService';
import { Toaster, toast } from 'sonner'
import { Categoria } from '../../types/Ingredientes/Categoria';

interface ActivarCategoriaProps {
  categoriaOriginal: Categoria;
  onCloseModal: () => void;
}

const ActivarCategoria: React.FC<ActivarCategoriaProps> = ({ categoriaOriginal, onCloseModal }) => {
  const onConfirm = () => {
    categoriaOriginal.borrado = 'NO';
    toast.promise(CategoriaService.updateCategoriaBorrado(categoriaOriginal), {
      loading: 'Activando Categoria...',
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

export default ActivarCategoria;
