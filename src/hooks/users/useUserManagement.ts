import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { showCustomToast } from '../../components/Ui/CustomToaster';
import { userService } from '../../service/userService';
import type { UserAccount } from '../../types/users';

export const USERS_QUERY_KEY = ['users'] as const;

export const useUserManagement = () => {
  const [search, setSearch] = useState('');
  const [deleteUser, setDeleteUser] = useState<UserAccount | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [...USERS_QUERY_KEY, currentPage],
    queryFn: () => userService.getUsers({ page: currentPage, limit }),
    staleTime: 5 * 60 * 1000,
  });

  const users: UserAccount[] = useMemo(() => {
    if (!data?.success) return [];
    return data.data.map(user => ({
      id: user.id,
      cedula: user.cedula,
      username: user.username,
      foto: user.foto ?? '',
      nombre: user.nombre,
      email: user.email,
      rol: user.rol as 'admin' | 'operador' | 'guarda',
      estado: user.estado,
      estado_registro: user.estado_registro,
    }));
  }, [data]);

  const totalUsers = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

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
      await userService.deleteUser(deleteUser.cedula!);
      setDeleteUser(null);
      showCustomToast('Éxito', 'Usuario eliminado exitosamente', 'success');
      await queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      toast.error(errorMessage);
    }
  };

  const handleAddUser = async () => {
    try {
      setAddModal(false);
      showCustomToast('Éxito', 'Usuario agregado exitosamente', 'success');
      await queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar usuario';
      toast.error(errorMessage);
    }
  };

  const refetch = () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return {
    filteredUsers,
    totalUsers,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar usuarios' : null,
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
