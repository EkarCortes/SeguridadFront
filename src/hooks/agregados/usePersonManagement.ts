import { useState } from "react";
import { usePersons } from "./usePersons";
import type { ExtendedPersona } from "../../components/table/personasColumns";
import { agregadosService } from "../../service/agregados/agregadosService";
import type { PersonFormData } from "../../types/agregados";

// Hook para manejar la lógica de gestión de personas, incluyendo edición, eliminación, adición y búsqueda.

export function usePersonManagement() {
  const { persons, totalPersonas, loading, error, refetch } = usePersons();
  const [editUser, setEditUser] = useState<ExtendedPersona | null>(null);
  const [deleteUser, setDeleteUser] = useState<ExtendedPersona | null>(null);
  const [photoUser, setPhotoUser] = useState<ExtendedPersona | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState("");


  const extendedPersons: ExtendedPersona[] = persons.map((person, index) => ({
    ...person,
    id: index + 1,
  }));

  
  const filteredPersons = extendedPersons.filter((a) =>
    [a.nombre, a.cedula, a.email, a.telefono]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleEdit(user: ExtendedPersona) {
    setEditUser(user);
  }

  async function handleSaveEdit(data: ExtendedPersona, updateData: any) {
    try {
      if (!data.cedula) {
        throw new Error("La cédula de la persona no puede ser nula.");
      }
      await agregadosService.updatePerson(data.cedula, updateData);
      console.log("Usuario actualizado exitosamente:", data);
      setEditUser(null);
      refetch();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar la persona. Por favor, intenta nuevamente.");
    }
  }

  function handleDelete(user: ExtendedPersona) {
    setDeleteUser(user);
  }

  async function confirmDelete(): Promise<void> {
    try {
      if (!deleteUser?.cedula) {
        throw new Error("La cédula de la persona no puede ser nula.");
      }
      await agregadosService.deletePerson(deleteUser.cedula);
      refetch();
      setDeleteUser(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar la persona. Por favor, intenta nuevamente.");
    }
  }

  function handleSelectPhoto(user: ExtendedPersona) {
    setPhotoUser(user);
  }

  async function handleAddUser(data: PersonFormData) {
    try {
      await agregadosService.registerPerson(data);
      console.log("Usuario registrado exitosamente:", data);
      setAddModal(false);
      refetch();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar la persona. Por favor, intenta nuevamente.");
    }
  }

  return {
    // Data
    filteredPersons,
    totalPersonas,
    loading,
    error,
    
    // Modal states
    editUser,
    deleteUser,
    photoUser,
    addModal,
    search,
    
    // Actions
    handleEdit,
    handleSaveEdit,
    handleDelete,
    confirmDelete,
    handleSelectPhoto,
    handleAddUser,
    setSearch,
    setAddModal,
    setEditUser,
    setDeleteUser,
    setPhotoUser,
    refetch
  };
}