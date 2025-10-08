import { useState } from "react";
import Modal from "../../components/Modal";
import DataTableGeneric from "../../components/table/DataTableGeneric";
import { getVerificacionesColumns, convertToCostaRicaTime, type ExtendedVerificacion } from "../../components/table/verificacionesColumns";
import { getTableStyles } from "../../styles/tableStyles";
import { useVerifications } from "../../hooks/useVerifications";
import imagen from "../../assets/noUser.jpg";

// Modal para mostrar la foto en grande

function PhotoModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: ExtendedVerificacion | null;
}) {
  return (
    <Modal open={open} onClose={onClose} size="md" title="Foto de verificación">
      <div className="flex flex-col items-center gap-4">
        {user?.image_source && (
          <img
            src={user.image_source || `${imagen}`}
            alt={user.person_label ?? "Desconocido"}
            className="w-64 h-64 rounded-xl object-cover border-2 border-[#303036] shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `${imagen}`;
            }}
          />
        )}
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold">{user?.person_label}</h3>
          <p className="text-neutral-400 text-sm">
            {user?.ts && `${convertToCostaRicaTime(user.ts).fechaFormatted} ${convertToCostaRicaTime(user.ts).horaFormatted}`}
          </p>
          <p className="text-neutral-400 text-sm">
            Caras detectadas: {user?.faces_detected}
          </p>
          <p className="text-neutral-400 text-sm">
            Estado: {user?.authorized ? "Autorizado" : "Denegado"}
          </p>
        </div>
      </div>
    </Modal>
  );
}

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
      
      {/* Modal ver foto */}
      <PhotoModal
        open={!!photoUser}
        onClose={() => setPhotoUser(null)}
        user={photoUser}
      />
    </>
  );
}