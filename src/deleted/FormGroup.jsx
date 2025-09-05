// components/FormGroup.jsx
import React from "react";
import "../styles/MyStyle.css";

const FormGroup = ({ label, children, htmlFor, className = "" }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormGroup;
