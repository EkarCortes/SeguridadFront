import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { showCustomToast } from '../../components/Ui/CustomToaster';
import { userService } from '../../service/userService';
import type { UserAccount } from '../../types/users';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteUser, setDeleteUser] = useState<UserAccount | null>(null);
  const [addModal, setAddModal] = useState(false);
  

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);


  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getUsers({ page, limit });
      
      if (response.success) {

        const mappedUsers: UserAccount[] = response.data.map(user => ({
          id: user.id,
          cedula: user.cedula, 
          username: user.username,
          foto: user.foto ?? '', 
          nombre: user.nombre,
          email: user.email,
          rol: user.rol as 'admin' | 'operador' | 'guarda',
          estado: user.estado, 
          fecha_registro: user.fecha_registro,
          
        }));
        
        setUsers(mappedUsers);
        console.log('Usuarios cargados:', mappedUsers);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotalUsers(response.pagination.total);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);


  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    
    const searchLower = search.toLowerCase();
    return users.filter(user =>
      user.nombre.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.rol.toLowerCase().includes(searchLower)
    );
  }, [users, search]);

  const handleDelete = (user: UserAccount) => {
    setDeleteUser(user);
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;

    try {
      setLoading(true);
      await userService.deleteUser(deleteUser.cedula!);
      
      setDeleteUser(null);
      showCustomToast('Éxito', 'Usuario eliminado exitosamente', 'success');
      

      await loadUsers(currentPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      

      setAddModal(false);
      showCustomToast('Éxito', 'Usuario agregado exitosamente', 'success');
      
 
      await loadUsers(currentPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar usuario';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadUsers(currentPage);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    filteredUsers,
    totalUsers,
    loading,
    error,
    deleteUser,
    addModal,
    search,
    currentPage,
    totalPages,
    handleDelete,
    confirmDelete,
    handleAddUser,
    setSearch,
    setAddModal,
    setDeleteUser,
    refetch,
    goToPage,
    nextPage,
    prevPage,
  };
};