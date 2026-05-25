import { useState } from "react";
import { UserPlus } from "lucide-react";
import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getPersonasColumns } from "../../components/table/personasColumns";
import ImageModal from "../../components/Ui/ImageModal";
import Modal from "../../components/Ui/Modal";
import EditForm from "../../components/forms/EditForm";
import AddForm from "../../components/forms/AddForm";
import HoldToConfirmButton from "../../components/Ui/HoldToConfirmButton";
import { usePersonManagement } from '../../hooks/agregados/usePersonManagement';
import CustomToaster from "../../components/Ui/CustomToaster";

export default function ListaAgregados() {
  const {
    filteredPersons,
    totalPersonas,
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
  } = usePersonManagement();

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
        data={filteredPersons}
        columns={getPersonasColumns(handleEdit, handleDelete, handleSelectPhoto)}
        totalItems={totalPersonas}
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        title="Lista de Personas"
        subtitle="Gestione los perfiles registrados y el acceso biométrico facial."
        searchPlaceholder="Buscar por nombre, cédula, email o teléfono..."
        rows={10}
        additionalActions={
          <button
            className="flex items-center gap-2 px-4 h-9 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onClick={() => setAddModal(true)}
            type="button"
          >
            <UserPlus size={14} />
            Agregar Persona
          </button>
        }
      />

      <Modal open={addModal} onClose={() => setAddModal(false)} size="md" title="Registrar Nueva Persona">
        <AddForm
          onSave={handleAddUser}
          onCancel={() => setAddModal(false)}
        />
      </Modal>

      <Modal open={!!editUser} onClose={() => setEditUser(null)} size="md" title="Editar Persona">
        {editUser && (
          <EditForm
            initial={editUser}
            onSave={handleSaveEdit}
            onCancel={() => setEditUser(null)}
          />
        )}
      </Modal>

      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} size="sm" title="Eliminar Persona">
        <div className="mb-4" style={{ color: "#fff" }}>
          ¿Seguro que deseas eliminar a <span className="font-bold">{deleteUser?.nombre}</span>?
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