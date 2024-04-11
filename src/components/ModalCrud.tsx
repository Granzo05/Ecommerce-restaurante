import React, { ReactNode } from 'react';

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
        <div className="modal-div" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
            <button className="modal-close" onClick={handleModalClose}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCrud;
