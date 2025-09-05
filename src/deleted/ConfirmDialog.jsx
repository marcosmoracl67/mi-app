// --- START OF FILE components/ConfirmDialog.jsx ---
import Modal from './Modal';
import FormButton from './FormButton';
import '../styles/components.css'; // O donde esté .modal-actions.spaced

const ConfirmDialog = ({
  isOpen,
  title = "¿Estás seguro?",
  message,
  onConfirm,
  onCancel,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  cancelVariant = "subtle",
  width = 30,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      width={width}
      showCloseButton={false} // <<< AÑADIDO: Oculta el botón 'X' para este modal específico
    >
      <div className="confirm-dialog-body">
        {message && <p className="confirm-dialog-message">{message}</p>}
        <div className="modal-actions spaced confirm-dialog-actions">
          <FormButton
            label={cancelText}
            onClick={onCancel}
            variant={cancelVariant}
            size="medium"
          />
          <FormButton
            label={confirmText}
            onClick={onConfirm}
            variant={confirmVariant}
            size="medium"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;