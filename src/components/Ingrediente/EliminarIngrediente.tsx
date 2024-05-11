import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { IngredienteService } from '../../services/IngredienteService';
import { Toaster, toast } from 'sonner'

interface EliminarIngredienteProps {
  ingredienteOriginal: Ingrediente;
}

const EliminarIngrediente: React.FC<EliminarIngredienteProps> = ({ ingredienteOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(IngredienteService.deleteIngrediente(ingredienteOriginal.id), {
      loading: 'Creando Ingrediente...',
      success: (message) => {
        navigate('/opciones');
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  const onCancel = () => {
    navigate('/opciones');
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
