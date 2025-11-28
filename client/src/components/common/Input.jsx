import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = forwardRef(
  (
    {
      type = 'text',
      label,
      error,
      helper,
      icon,
      variant = 'default',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseClass = 'input';
    const wrapperClasses = [
      'input-wrapper',
      `input-${variant}`,
      `input-${size}`,
      fullWidth ? 'input-full' : '',
      disabled ? 'input-disabled' : '',
      error ? 'input-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      baseClass,
      icon ? 'input-with-icon' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        <div className="input-field">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            required={required}
            {...props}
          />
        </div>
        {(error || helper) && (
          <span className={`input-message ${error ? 'input-error-message' : 'input-helper-message'}`}>
            {error || helper}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helper: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'filled', 'outlined']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input; 