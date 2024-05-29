import React from 'react';
import { EmpresaService } from '../../services/EmpresaService';
import { Toaster, toast } from 'sonner'
import { Empresa } from '../../types/Restaurante/Empresa';

interface ActivarEmpresaProps {
  empresa: Empresa;
  onCloseModal: () => void;

}

const ActivarEmpresa: React.FC<ActivarEmpresaProps> = ({ empresa, onCloseModal }) => {
  const onConfirm = () => {
    empresa.borrado = 'NO';
    toast.promise(EmpresaService.updateEmpresaBorrado(empresa), {
      loading: 'Activando empresa...',
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
      <Toaster />
      <h2>¿Seguro que quieres activar la empresa?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarEmpresa;
