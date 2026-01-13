function Button({ children, variant = 'primary', type = 'button', disabled, onClick, className = '' }) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const classes = className ? `${baseClass} ${variantClass} ${className}` : `${baseClass} ${variantClass}`;

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
