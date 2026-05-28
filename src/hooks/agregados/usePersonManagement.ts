import { useState } from "react";
import { usePersons } from "./usePersons";
import type { ExtendedPersona } from "../../components/table/personasColumns";
import { agregadosService } from "../../service/agregados/agregadosService";
import { showCustomToast } from "../../components/Ui/CustomToaster";

export function usePersonManagement() {
  const { persons, totalPersonas, loading, error, refetch } = usePersons();
  const [deleteUser, setDeleteUser] = useState<ExtendedPersona | null>(null);
  const [photoUser, setPhotoUser] = useState<ExtendedPersona | null>(null);
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

  function handleDelete(user: ExtendedPersona) {
    setDeleteUser(user);
  }

  async function confirmDelete(): Promise<void> {
    try {
      if (!deleteUser?.cedula) throw new Error("La cédula no puede ser nula.");
      await agregadosService.deletePerson(deleteUser.cedula);
      refetch();
      setDeleteUser(null);
      showCustomToast('Éxito', 'Persona eliminada correctamente.', 'success');
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar la persona. Por favor, intenta nuevamente.");
    }
  }

  function handleSelectPhoto(user: ExtendedPersona) {
    setPhotoUser(user);
  }

  return {
    filteredPersons,
    totalPersonas,
    loading,
    error,
    deleteUser,
    photoUser,
    search,
    handleDelete,
    confirmDelete,
    handleSelectPhoto,
    setSearch,
    setDeleteUser,
    setPhotoUser,
    refetch,
  };
}
