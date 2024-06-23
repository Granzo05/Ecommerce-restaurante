import React from 'react';
import { Toaster, toast } from 'sonner'
import { ClienteService } from '../../../services/ClienteService';
import { Cliente } from '../../../types/Cliente/Cliente';

interface EliminarCategoriaProps {
  clienteOriginal: Cliente;
  onCloseModal: () => void;

}

const EliminarCliente: React.FC<EliminarCategoriaProps> = ({ clienteOriginal, onCloseModal }) => {

  const onConfirm = () => {
    clienteOriginal.borrado = 'SI';
    toast.promise(ClienteService.updateUser(clienteOriginal), {
      loading: 'Eliminando Categoria...',
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

      <h2>¿Seguro que quieres bloquear la cuenta del cliente?</h2>
      <Toaster />
      <button onClick={onConfirm}>Confirmar</button>
      <br />
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default EliminarCliente;
