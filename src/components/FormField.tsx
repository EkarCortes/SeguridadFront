
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
  helperText
}: FormFieldProps) {
  const baseClasses = "w-full rounded px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700";
  const enabledClasses = "bg-[#18181b] text-white";
  const disabledClasses = "bg-[#27272a] text-neutral-400 cursor-not-allowed";

  return (
    <div className="flex-1">
      <label className="block text-neutral-400 text-sm mb-1">
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
      />
      {helperText && (
        <p className="text-xs text-neutral-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}