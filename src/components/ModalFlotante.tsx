import React, { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalFlotante: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleModalClose = () => {
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-flotante-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
            {children}
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
              <button  onClick={handleModalClose}>Cancelar</button>
            </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ModalFlotante;
