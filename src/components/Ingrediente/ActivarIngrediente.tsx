import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ingrediente } from '../../types/Ingredientes/Ingrediente';
import { IngredienteService } from '../../services/IngredienteService';
import { Toaster, toast } from 'sonner'

interface ActivarIngredienteProps {
  ingredienteOriginal: Ingrediente;
}

const ActivarIngrediente: React.FC<ActivarIngredienteProps> = ({ ingredienteOriginal }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    toast.promise(IngredienteService.deleteIngrediente(ingredienteOriginal.id), {
      loading: 'Activando Ingrediente...',
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
      <p>¿Seguro que quieres activar el ingrediente?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarIngrediente;
