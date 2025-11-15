import { useState, useEffect } from "react";
import FormField from "../Ui/FormField";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { userService } from "../../service/userService";
import { showCustomToast } from "../Ui/CustomToaster";

// Este componente maneja el formulario para agregar un nuevo usuario

type AddUserFormData = {
    person_id?: number;
    cedula: string;
    nombre: string;
    email: string;
    username: string;
    password: string;
    rol: "admin" | "operador" | "guarda";
};

interface AddUserFormProps {
    onSave: (data: AddUserFormData) => void;
    onCancel: () => void;
}

export default function AddUserForm({ onSave, onCancel }: AddUserFormProps) {
    const [formData, setFormData] = useState<AddUserFormData>({
        cedula: "",
        nombre: "",
        email: "",
        username: "",
        password: "",
        rol: "operador",
    });

    const [isSearching, setIsSearching] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [personFound, setPersonFound] = useState(false);

    const searchUserByCedula = async (cedula: string) => {
        if (cedula.length < 3) {
            setPersonFound(false);
            setFormData(prev => ({
                ...prev,
                person_id: undefined,
                nombre: "",
                email: "",
            }));
            return;
        }

        setIsSearching(true);
        try {
            const person = await userService.getPersonByCedula(cedula);
            
            setFormData(prev => ({
                ...prev,
                person_id: person.person_id,
                nombre: person.nombre_completo,
                email: person.email,
            }));
            setPersonFound(true);
            showCustomToast("Éxito", "Persona encontrada", "success");
        } catch (error) {
            setPersonFound(false);
            setFormData(prev => ({
                ...prev,
                person_id: undefined,
                nombre: "",
                email: "",
            }));
            showCustomToast("Error", "No se encontró ninguna persona con esa cédula", "info");
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (formData.cedula) {
            const timeout = setTimeout(() => {
                searchUserByCedula(formData.cedula);
            }, 500); // 500ms de debounce
            setSearchTimeout(timeout);
        } else {
            setPersonFound(false);
            setFormData(prev => ({
                ...prev,
                person_id: undefined,
                nombre: "",
                email: "",
            }));
        }

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [formData.cedula]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.person_id) {
            showCustomToast("Error", "Debe buscar y seleccionar una persona válida antes de registrar el usuario", "info");
            return;
        }

        try {
            await userService.registerUser({
                username: formData.username,
                password: formData.password,
                person_id: formData.person_id,
                rol: formData.rol,
            });
            
      
            onSave(formData);
            
            setFormData({
                cedula: "",
                nombre: "",
                email: "",
                username: "",
                password: "",
                rol: "operador",
            });
            setPersonFound(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error al registrar usuario";
            showCustomToast("Error", errorMessage, "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="relative mb-4">
                <FormField
                    label="Buscar por cédula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese la cédula"
                />
                {isSearching && (
                    <div className="absolute right-3 top-9 text-gray-400">
                        Buscando...
                    </div>
                )}
                {personFound && (
                    <div className="mt-1 text-green-500 text-sm">
                        ✓ Persona encontrada
                    </div>
                )}
            </div>

       
            <div className="flex flex-wrap gap-4">
                <FormField
                    label="Nombre Completo"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled
                    className="min-w-[220px] flex-1"
                />
                <FormField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                    disabled
                    className="min-w-[220px] flex-1"
                />
            </div>

            <div className="flex flex-wrap gap-4">
                <FormField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Nombre de usuario"
                    className="min-w-[180px] flex-1"
                />
                
                <div className="relative min-w-[180px] flex-1">
                    <FormField
                        label="Contraseña"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Mínimo 6 caracteres"
                        className="min-w-[180px] flex-1"
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                        onClick={() => setShowPassword(v => !v)}
                        style={{ background: "none", border: "none", padding: 0 }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="flex-1 min-w-[180px]">
                    <label className="block text-neutral-200 text-sm mb-1">
                        Rol <span className="text-red-400">*</span>
                    </label>
                    <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                        className="w-full rounded px-3 py-2 border border-[#ccc] bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="operador">Operador</option>
                        <option value="admin">Administrador</option>
                        <option value="guarda">Guarda</option>
                    </select>
                </div>
            </div>


            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-3 w-full">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-2 py-1 rounded bg-neutral-600 text-white hover:bg-neutral-500 transition w-full text-lg font-semibold"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!personFound || isSearching}
                    className="px-2 py-2 rounded bg-[#6FBF73] text-white hover:bg-[#58985C] transition w-full text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}