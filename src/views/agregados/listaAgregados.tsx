import AddIcon from "@mui/icons-material/Add";
import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getPersonasColumns } from "../../components/table/personasColumns";
import { getTableStyles } from "../../styles/tableStyles";
import PersonaPhotoModal from "../../components/ModalPhoto";
import Modal from "../../components/Modal";
import EditForm from "../../components/forms/EditForm";
import AddForm from "../../components/forms/AddForm";
import { usePersonManagement } from "../../hooks/usePersonManagement";

export default function ListaAgregados() {
  const {
    filteredPersons,
    totalPersonas,
    loading,
    error,
    editUser,
    deleteUser,
    photoUser,
    addModal,
    search,
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
  } = usePersonManagement();

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
      searchPlaceholder="Buscar por nombre, cédula, email o teléfono..."
      noDataMessage="No hay personas registradas."
      rowsPerPage={10}
      customStyles={getTableStyles()}
      additionalActions={
        <button
        className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-800 transition"
        onClick={() => setAddModal(true)}
        title="Agregar nuevo"
        type="button"
        >
        <AddIcon fontSize="small" />
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
      <div className="mb-4" style={{ color: "#1f364a" }}>
        ¿Seguro que deseas eliminar a <span className="font-bold">{deleteUser?.nombre}</span>?
      </div>
      <div className="flex justify-end gap-2">
        <button
        className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-500"
        onClick={() => setDeleteUser(null)}
        >
        Cancelar
        </button>
        <button
        className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-600"
        onClick={confirmDelete}
        >
        Eliminar
        </button>
      </div>
      </Modal>

      <PersonaPhotoModal
      open={!!photoUser}
      onClose={() => setPhotoUser(null)}
      user={photoUser}
      />
    </>
  );
}