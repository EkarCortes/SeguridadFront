import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getUsersColumns } from "../../components/table/usersColumns";
import { getTableStyles } from "../../styles/tableStyles";
import ImageModal from "../../components/Ui/ImageModal";
import Modal from "../../components/Ui/Modal";
import EditUserForm from "../../components/forms/EditForm";
import AddUserForm from "../../components/forms/AddForm";
import HoldToConfirmButton from "../../components/Ui/HoldToConfirmButton";
import CustomToaster from "../../components/Ui/CustomToaster";
import { useUserManagement } from '../../hooks/users/useUserManagement';

export default function ListaUsuarios() {
  const {
    filteredUsers,
    totalUsers,
    loading,
    error,
    editUser,
    deleteUser,
    addModal,
    search,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    confirmDelete,
    handleAddUser,
    setSearch,
    setAddModal,
    setEditUser,
    setDeleteUser,
    refetch
  } = useUserManagement();

  // Estado para el modal de imagen
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>('');

  const handleSelectPhoto = (imageUrl: string, alt: string) => {
    setSelectedImage(imageUrl);
    setImageAlt(alt);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
    setImageAlt('');
  };

  return (
    <>
      <DataTableGeneric
        data={filteredUsers}
        columns={getUsersColumns(handleEdit, handleDelete, handleSelectPhoto)}
        totalItems={totalUsers}
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        title="Lista de Usuarios"
        searchPlaceholder="Buscar por nombre, email o rol..."
        noDataMessage="No hay usuarios registrados."
        rowsPerPage={10}
        customStyles={getTableStyles()}
        additionalActions={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#6FBF73] text-white hover:bg-[#58985C] transition"
            onClick={() => setAddModal(true)}
            title="Agregar nuevo usuario"
            type="button"
          >
            <AddIcon fontSize="small" />
          </button>
        }
      />

      <Modal open={addModal} onClose={() => setAddModal(false)} size="md" title="Registrar Nuevo Usuario">
        <AddUserForm
          onSave={handleAddUser}
          onCancel={() => setAddModal(false)}
        />
      </Modal>

      <Modal open={!!editUser} onClose={() => setEditUser(null)} size="md" title="Editar Usuario">
        {editUser && (
          <EditUserForm
            initial={editUser}
            onSave={handleSaveEdit}
            onCancel={() => setEditUser(null)}
          />
        )}
      </Modal>

      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} size="sm" title="Eliminar Usuario">
        <div className="mb-4" style={{ color: "#fff" }}>
          ¿Seguro que deseas eliminar al usuario <span className="font-bold">{deleteUser?.nombre}</span>?
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-500"
            onClick={() => setDeleteUser(null)}
          >
            Cancelar
          </button>
          <HoldToConfirmButton
            onConfirm={confirmDelete}
            holdDuration={2000}
            label="Mantener para Eliminar"
            holdingLabel="Manteniendo..."
          />
        </div>
      </Modal>

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
        alt={imageAlt}
      />
      <CustomToaster />
    </>
  );
}