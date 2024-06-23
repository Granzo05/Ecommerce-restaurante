import React from 'react';
import { Toaster, toast } from 'sonner'
import { ClienteService } from '../../../services/ClienteService';
import { Cliente } from '../../../types/Cliente/Cliente';

interface ActivarCategoriaProps {
  clienteOriginal: Cliente;
  onCloseModal: () => void;
}

const ActivarCliente: React.FC<ActivarCategoriaProps> = ({ clienteOriginal, onCloseModal }) => {
  const onConfirm = () => {
    clienteOriginal.borrado = 'NO';
    toast.promise(ClienteService.updateUser(clienteOriginal), {
      loading: 'Activando cuenta del cliente...',
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
      <h2>¿Seguro que quieres desbloquear la cuenta del cliente?</h2>
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default ActivarCliente;
