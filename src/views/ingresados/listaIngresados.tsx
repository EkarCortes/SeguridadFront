import { useState } from "react";

import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getVerificacionesColumns, convertToCostaRicaTime, type ExtendedVerificacion } from "../../components/table/verificacionesColumns";
import { getTableStyles } from "../../styles/tableStyles";
import { useVerifications } from "../../hooks/useVerifications";
import PersonaPhotoModal from "../../components/ModalPhoto";


// Modal para mostrar la foto en grande



export default function ListaIngresados() {
  const { verifications, totalVerificaciones, loading, error, refetch } = useVerifications();
  const [photoUser, setPhotoUser] = useState<ExtendedVerificacion | null>(null);
  const [search, setSearch] = useState("");

  const extendedVerifications: ExtendedVerificacion[] = verifications || [];

  function handleSelectPhoto(user: ExtendedVerificacion) {
    setPhotoUser(user);
  }

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

      <PersonaPhotoModal
        open={!!photoUser}
        onClose={() => setPhotoUser(null)}
        user={photoUser}
        type="ingresado"
      />
    </>
  );
}