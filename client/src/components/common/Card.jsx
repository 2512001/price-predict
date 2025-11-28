import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  size = 'medium',
  hoverable = false,
  clickable = false,
  className,
  onClick,
  ...props
}) => {
  const baseClass = 'card';
  const classes = [
    baseClass,
    `card-${variant}`,
    `card-${size}`,
    hoverable ? 'card-hoverable' : '',
    clickable ? 'card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className, ...props }) => (
  <div className={`card-header ${className || ''}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className, ...props }) => (
  <div className={`card-body ${className || ''}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className, ...props }) => (
  <div className={`card-footer ${className || ''}`} {...props}>
    {children}
  </div>
);

Card.Image = ({ src, alt, className, ...props }) => (
  <div className={`card-image ${className || ''}`}>
    <img src={src} alt={alt} {...props} />
  </div>
);

Card.Title = ({ children, className, ...props }) => (
  <h3 className={`card-title ${className || ''}`} {...props}>
    {children}
  </h3>
);

Card.Text = ({ children, className, ...props }) => (
  <p className={`card-text ${className || ''}`} {...props}>
    {children}
  </p>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Card.Title.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card; 