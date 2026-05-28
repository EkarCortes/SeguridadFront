import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getPersonasColumns } from "../../components/table/personasColumns";
import ImageModal from "../../components/Ui/ImageModal";
import Modal from "../../components/Ui/Modal";
import HoldToConfirmButton from "../../components/Ui/HoldToConfirmButton";
import { usePersonManagement } from '../../hooks/agregados/usePersonManagement';
import CustomToaster from "../../components/Ui/CustomToaster";
import type { ExtendedPersona } from "../../components/table/personasColumns";

export default function ListaAgregados() {
  const navigate = useNavigate();
  const {
    filteredPersons,
    totalPersonas,
    loading,
    error,
    deleteUser,
    search,
    handleDelete,
    confirmDelete,
    setSearch,
    setDeleteUser,
    refetch
  } = usePersonManagement();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>('');

  const handleSelectPhoto = (imageUrl: string, alt: string) => {
    setSelectedImage(imageUrl);
    setImageAlt(alt);
    setIsImageModalOpen(true);
  };

  const handleEdit = (persona: ExtendedPersona) => {
    navigate("/editarPersona", { state: { persona } });
  };

  return (
    <div className="page-enter w-full">
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
            className="flex items-center gap-2 px-4 h-9 rounded-xl bg-[#262c3e] text-white text-sm font-medium hover:bg-[#262c3e] transition"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onClick={() => navigate("/agregarPersona")}
            type="button"
          >
            <UserPlus size={14} />
            Agregar Persona
          </button>
        }
      />

      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} size="sm" title="Eliminar Persona">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            ¿Seguro que deseas eliminar a{" "}
            <span className="font-semibold text-slate-900">{deleteUser?.nombre}</span>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2.5">
            <button
              className="flex-1 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              style={{ fontFamily: "'Inter', sans-serif" }}
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
        </div>
      </Modal>

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={() => { setIsImageModalOpen(false); setSelectedImage(null); setImageAlt(''); }}
        alt={imageAlt}
      />
      <CustomToaster />
    </div>
  );
}
