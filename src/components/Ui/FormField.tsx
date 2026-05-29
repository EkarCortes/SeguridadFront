//Este componente es un campo de formulario reutilizable con estilos personalizados y soporte para deshabilitar el campo, se utiliza en el add form y edit form.
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  placeholder,
  helperText,
  className = ""
}: FormFieldProps) {
  const baseClasses = "w-full rounded-xl border text-sm px-3 py-2.5 focus:outline-none transition";
  const enabledClasses = "bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-[#262c3e]/10 focus:border-slate-400 placeholder-slate-300";
  const disabledClasses = "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed";

  return (
    <div className={`flex-1 ${className}`}>
      <label className="block text-slate-700 text-sm mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        title={disabled ? `${label} no se puede editar` : undefined}
        minLength={type === "password" ? 6 : undefined}
      />
      {helperText && (
        <p className="text-xs text-slate-700 mt-1">{helperText}</p>
      )}
    </div>
  );
}