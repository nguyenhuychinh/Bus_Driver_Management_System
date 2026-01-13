function Input({
  label,
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  disabled,
  error,
  required = false,
  className = '',
}) {
  const wrapperClass = className ? `form-row ${className}` : 'form-row';

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="label">
          {label}
          {required && ' *'}
        </label>
      )}
      <input
        className="input"
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export default Input;
