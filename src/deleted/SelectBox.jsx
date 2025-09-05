import PropTypes from "prop-types";
import "../styles/components.css";

const SelectBox = ({
  label,
  options,
  value,
  onChange,
  idKey = "id",
  labelKey = "nombre",
  disabled = false,
  placeholder = "Seleccione..."
}) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <select
      className="form-select-box"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt[idKey]} value={opt[idKey]}>
          {opt[labelKey]}
        </option>
      ))}
    </select>
  </div>
);

SelectBox.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  idKey: PropTypes.string,
  labelKey: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string
};

export default SelectBox;
