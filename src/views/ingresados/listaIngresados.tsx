import { useState } from "react";
import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getVerificacionesColumns, convertToCostaRicaTime } from "../../components/table/verificacionesColumns";
import { getTableStyles } from "../../styles/tableStyles";
import { useVerifications } from "../../hooks/verficados/useVerifications";
import ImageModal from "../../components/Ui/ImageModal";

export default function ListaIngresados() {
  const { verifications, totalVerificaciones, loading, error, refetch } = useVerifications();
  const [search, setSearch] = useState("");
  
  // Estado para el modal de imagen
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>('');

  const extendedVerifications = verifications || [];

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

  // Filtrado por búsqueda
  const filteredIngresados = extendedVerifications.filter((i) => {
    const searchableText = [
      i.person_label ?? "Desconocido",
      i.id,
      i.ts ? convertToCostaRicaTime(i.ts).fechaFormatted : ''
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  return (
    <>
      <DataTableGeneric
        data={filteredIngresados}
        columns={getVerificacionesColumns(handleSelectPhoto)}
        totalItems={totalVerificaciones}
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={setSearch}
        onRefresh={refetch}
        title="Lista de Verificaciones"
        searchPlaceholder="Buscar por nombre, ID o fecha..."
        noDataMessage="No hay registros de verificaciones."
        rowsPerPage={10}
        customStyles={getTableStyles()}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={handleCloseImageModal}
        alt={imageAlt}
      />
    </>
  );
}