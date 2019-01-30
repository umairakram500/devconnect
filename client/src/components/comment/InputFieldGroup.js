import React from "react";
import classnames from "classnames";
import propTypes from "prop-types";

const InputFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
      {label &&
        <label className="invalid-feedback">
          {label}
        </label>}
      <input
        type={type}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
      {info &&
        <small className="form-text text-muted">
          {info}
        </small>}
      {error &&
        <div className="invalid-feedback">
          {error}
        </div>}
    </div>
  );
};

InputFieldGroup.propTypes = {
  name: propTypes.string.isRequired,
  placeholder: propTypes.string,
  value: propTypes.string.isRequired,
  label: propTypes.string,
  error: propTypes.array,
  info: propTypes.string,
  type: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  disabled: propTypes.string
};

InputFieldGroup.defaultProps = {
  type: "text"
};

export default InputFieldGroup;
