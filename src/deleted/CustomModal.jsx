import ReactDOM from "react-dom";
import { FaRegWindowClose } from "react-icons/fa";
import '../styles/custom-modal.css';

const CustomModal = ({ isOpen, title, width = 40, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="custom-modal-overlay" />
      <div className="custom-modal" style={{ width: `${width}rem` }}>
        <button className="custom-modal-close" onClick={onClose}>
        <FaRegWindowClose />
        </button>
        <h2 className="custom-modal-title">{title}</h2>
        <div className="custom-modal-body">
            {children}
        </div>
      </div>
    </>,
    document.body
  );
};

export default CustomModal;
