import React from 'react';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

const Button = ({
  children,
  type,
  style,
  size,
  onClick
}) => {
  const checkStyle = STYLES.includes(style) ? style : STYLES[0];
  const checkSize = SIZES.includes(size) ? size : SIZES[0];

  return (
    <button
      className={`btn ${checkStyle} ${checkSize}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;