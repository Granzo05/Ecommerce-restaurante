import React from 'react';
import { Categoria } from '../../types/Ingredientes/Categoria';
import { CategoriaService } from '../../services/CategoriaService';
import { Toaster, toast } from 'sonner'

interface EliminarCategoriaProps {
  categoriaOriginal: Categoria;
  onCloseModal: () => void;

}

const EliminarCategoria: React.FC<EliminarCategoriaProps> = ({ categoriaOriginal, onCloseModal }) => {

  const onConfirm = () => {
    toast.promise(CategoriaService.deleteCategoria(categoriaOriginal.id), {
      loading: 'Creando Categoria...',
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
      
      <h2>¿Seguro que quieres eliminar la categoria?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarCategoria;
