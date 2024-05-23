import React from 'react';
import { EmpresaService } from '../../services/EmpresaService';
import { Toaster, toast } from 'sonner'
import { Empresa } from '../../types/Restaurante/Empresa';

interface EliminarEmpresaProps {
  empresa: Empresa;
  onCloseModal: () => void;
}

const EliminarEmpresa: React.FC<EliminarEmpresaProps> = ({ empresa, onCloseModal }) => {

  const onConfirm = () => {
    toast.promise(EmpresaService.updateRestaurant(empresa), {
      loading: 'Eliminando empresa...',
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
    <div className='modal-info'>
      <h2>¿Seguro que quieres eliminar la empresa?</h2>
      <Toaster />
        <button onClick={onConfirm}>Confirmar</button>
        <br />
        <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarEmpresa;
