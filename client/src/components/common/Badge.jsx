import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  pill = false,
  dot = false,
  count,
  max,
  className,
  ...props
}) => {
  const baseClass = 'badge';
  const classes = [
    baseClass,
    `badge-${variant}`,
    `badge-${size}`,
    pill ? 'badge-pill' : '',
    dot ? 'badge-dot' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderContent = () => {
    if (dot) return null;
    if (typeof count === 'number') {
      if (max && count > max) {
        return `${max}+`;
      }
      return count;
    }
    return children;
  };

  return (
    <span className={classes} {...props}>
      {renderContent()}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  pill: PropTypes.bool,
  dot: PropTypes.bool,
  count: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
};

export default Badge; 