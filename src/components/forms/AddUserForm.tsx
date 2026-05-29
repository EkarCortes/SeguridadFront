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
                        className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(v => !v)}
                        style={{ background: "none", border: "none", padding: 0 }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="flex-1 min-w-[180px]">
                    <label className="block text-slate-700 text-sm mb-1">
                        Rol <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            required
                            className="w-full appearance-none rounded-xl border text-sm px-3 py-2.5 pr-9 bg-slate-50 border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#262c3e]/10 focus:border-slate-400 transition cursor-pointer"
                        >
                            <option value="operador">Operador</option>
                            <option value="admin">Administrador</option>
                            <option value="guarda">Guarda</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 w-full">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition w-full"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!personFound || isSearching}
                    className="h-10 px-5 rounded-xl text-white text-sm font-semibold transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "#262c3e", fontFamily: "'Inter', sans-serif" }}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}