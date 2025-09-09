// components/Modal.jsx
import React from "react";

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="editModalContainer">
      <div className="editModalContainer__editModal">
        <div className="">
          <div className="editModalContainer__editModal__btnCloseModal">
            <button onClick={onClose} className="editModalContainer__editModal__btnCloseModal__prop">✕</button>
          </div>
          <h3 className="editModalContainer__editModal__title">{title}</h3>
        </div>

        <div className="">{children}</div>

        {footer && <div className="editModalContainer__editModal__footer">{footer}</div>}
      </div>
    </div>
  );
}
