import React, { ReactNode } from 'react';
import '../styles/modalCrud.css'
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalCrud: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleModalClose = () => {
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div className="modal-div">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalClose}><CloseIcon/></button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCrud;
