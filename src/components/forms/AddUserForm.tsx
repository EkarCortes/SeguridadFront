import { useState, useEffect } from "react";
import FormField from "../Ui/FormField";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type AddUserFormData = {
    id?: number;
    cedula: string;
    nombre: string;
    email: string;
    telefono: string;
    direccion?: string;
    username: string;
    password: string;
    rol: "admin" | "user" | "viewer";
};

interface UserSearchResult {
    cedula: string;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
}

interface AddUserFormProps {
    onSave: (data: AddUserFormData) => void;
    onCancel: () => void;
}

export default function AddUserForm({ onSave, onCancel }: AddUserFormProps) {
    const [formData, setFormData] = useState<AddUserFormData>({
        id: 0,
        cedula: "",
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        username: "",
        password: "",
        rol: "user",
    });

    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Función para buscar usuarios por cédula
    const searchUserByCedula = async (cedula: string) => {
        if (cedula.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }


        setIsSearching(true);
        try {
            const mockData: UserSearchResult[] = [
                {
                    cedula: "1234567890",
                    nombre: "Juan Pérez García",
                    email: "juan.perez@example.com",
                    telefono: "0991234567",
                    direccion: "Av. Principal 123",
                },
                {
                    cedula: "1234567891",
                    nombre: "María González López",
                    email: "maria.gonzalez@example.com",
                    telefono: "0991234568",
                    direccion: "Calle Secundaria 456",
                },
                {
                    cedula: "1234567892",
                    nombre: "Carlos Rodríguez Sánchez",
                    email: "carlos.rodriguez@example.com",
                    telefono: "0991234569",
                    direccion: "Av. Los Pinos 789",
                },
            ];

            const filtered = mockData.filter(user =>
                user.cedula.includes(cedula)
            );

            setSearchResults(filtered);
            setShowResults(filtered.length > 0);
        } catch (error) {
            setSearchResults([]);
            setShowResults(false);
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
            }, 500);
            setSearchTimeout(timeout);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [formData.cedula]);

    const handleSelectUser = (user: UserSearchResult) => {
        setFormData(prev => ({
            ...prev,
            cedula: user.cedula,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono || "",
            direccion: user.direccion || "",
        }));
        setShowResults(false);
        setSearchResults([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formData);
        setFormData({
            cedula: "",
            nombre: "",
            email: "",
            telefono: "",
            direccion: "",
            username: "",
            password: "",
            rol: "user",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda por Cédula */}
            <div className="relative mb-4">
                <FormField
                    label="Buscar por cédula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                />
                {isSearching && (
                    <div className="absolute right-3 top-9 text-gray-400">
                        Buscando...
                    </div>
                )}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#f3f6fa] border border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((user) => (
                            <button
                                key={user.cedula}
                                type="button"
                                onClick={() => handleSelectUser(user)}
                                className="w-full text-left px-4 py-3 hover:bg-[#f3f6fa] transition border-b border-gray-700 last:border-b-0"
                            >
                                <div className="text-[3A3A3A] font-medium">{user.nombre}</div>
                                <div className="text-gray-600 text-sm">CI: {user.cedula}</div>
                                <div className="text-gray-700 text-xs">{user.email}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Campos horizontales */}
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
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    disabled
                    className="min-w-[180px] flex-1"
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
                    className="min-w-[180px] flex-1"
                />
                
                <div className="relative min-w-[180px] flex-1">
                    <FormField
                        label="Contraseña"
                        name="password"
                        value={formData.password}
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            password: (e.target as HTMLInputElement).value,
                        }))}
                        type={showPassword ? "text" : "password"}
                        required
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
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="viewer">Visualizador</option>
                    </select>
                </div>
            </div>
            {/* Botones */}
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
                    className="px-2 py-2 rounded bg-[#6FBF73] text-white hover:bg-[#58985C] transition w-full text-lg font-semibold"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}