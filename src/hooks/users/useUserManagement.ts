import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import type { User } from '../../types/users';
import { showCustomToast } from '../../components/Ui/CustomToaster';

// Datos quemados para pruebas
const MOCK_USERS: User[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    rol: "admin",
    activo: true,
    foto_url: "https://randomuser.me/api/portraits/men/1.jpg",
    fecha_registro: "2024-01-15T10:30:00Z",
    ultimo_login: "2024-11-12T08:45:00Z"
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@example.com",
    rol: "user",
    activo: true,
    foto_url: "https://randomuser.me/api/portraits/women/2.jpg",
    fecha_registro: "2024-02-20T14:20:00Z",
    ultimo_login: "2024-11-11T15:30:00Z"
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos.lopez@example.com",
    rol: "user",
    activo: false,
    foto_url: "https://randomuser.me/api/portraits/men/3.jpg",
    fecha_registro: "2024-03-10T09:15:00Z",
    ultimo_login: "2024-10-28T12:00:00Z"
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana.martinez@example.com",
    rol: "admin",
    activo: true,
    foto_url: "https://randomuser.me/api/portraits/women/4.jpg",
    fecha_registro: "2024-04-05T11:45:00Z",
    ultimo_login: "2024-11-12T09:20:00Z"
  },
  {
    id: 5,
    nombre: "Pedro Rodríguez",
    email: "pedro.rodriguez@example.com",
    rol: "user",
    activo: true,
    foto_url: "https://randomuser.me/api/portraits/men/5.jpg",
    fecha_registro: "2024-05-18T16:30:00Z",
    ultimo_login: "2024-11-10T14:15:00Z"
  },
  {
    id: 6,
    nombre: "Laura Fernández",
    email: "laura.fernandez@example.com",
    rol: "user",
    activo: true,
    foto_url: "https://randomuser.me/api/portraits/women/6.jpg",
    fecha_registro: "2024-06-22T13:00:00Z",
    ultimo_login: "2024-11-12T10:30:00Z"
  },
  {
    id: 7,
    nombre: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    rol: "user",
    activo: false,
    foto_url: "https://randomuser.me/api/portraits/women/8.jpg",
    fecha_registro: "2024-07-14T10:00:00Z",
    ultimo_login: "2024-09-15T08:00:00Z"
  },
  {
    id: 8,
    nombre: "Sofia Torres",
    email: "sofia.torres@example.com",
    rol: "admin",
    activo: true,
    foto_url: "https://randomuser.me/api/portraits/women/8.jpg",
    fecha_registro: "2024-08-30T12:30:00Z",
    ultimo_login: "2024-11-12T07:45:00Z"
  }
];

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [addModal, setAddModal] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    const loadUsers = () => {
      setLoading(true);
      setTimeout(() => {
        setUsers(MOCK_USERS);
        setLoading(false);
      }, 800);
    };

    loadUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    
    const searchLower = search.toLowerCase();
    return users.filter(user =>
      user.nombre.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.rol.toLowerCase().includes(searchLower)
    );
  }, [users, search]);

  const totalUsers = filteredUsers.length;

 


  const handleDelete = (user: User) => {
    setDeleteUser(user);
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;

    try {
      setLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prevUsers =>
        prevUsers.filter(user => user.id !== deleteUser.id)
      );
      
      setDeleteUser(null);
      showCustomToast('Éxito', 'Usuario eliminado exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (newUserData: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        ...newUserData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
        fecha_registro: new Date().toISOString(),
      };
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      setAddModal(false);
      showCustomToast('Éxito', 'Usuario agregado exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers([...MOCK_USERS]);
      setLoading(false);
      showCustomToast('Éxito', 'Datos recargados correctamente', 'success');
    }, 500);
  };

  return {
    filteredUsers,
    totalUsers,
    loading,
    error,
    deleteUser,
    addModal,
    search,
    handleDelete,
    confirmDelete,
    handleAddUser,
    setSearch,
    setAddModal,
    setDeleteUser,
    refetch,
  };
};