import React from "react";
import Modal from "./Modal";
import api from "../config/apiconfig";
import imagen from "../assets/noUser.jpg";
import { convertToCostaRicaTime } from "../components/table/verificacionesColumns"; // Ajusta el import si es necesario

//Este componente Modal se utiliza para mostrar la foto y detalles de un usuario en una ventana emergente centrada en la pantalla.

type PersonaPhotoModalProps =
  | {
      open: boolean;
      onClose: () => void;
      user: {
        foto_url?: string | null;
        nombre?: string | null;
        cedula?: string | null;
        email?: string | null;
        telefono?: string | null;
        [key: string]: any;
      } | null;
      type: "agregado";
    }
  | {
      open: boolean;
      onClose: () => void;
      user: {
        image_source?: string | null;
        person_label?: string | null;
        ts?: string  | null;
        faces_detected?: number | null;
        authorized?: boolean | null;
        [key: string]: any;
      } | null;
      type: "ingresado";
    };

const PersonaPhotoModal: React.FC<PersonaPhotoModalProps> = (props) => {
  const { open, onClose, user, type } = props;

  if (type === "ingresado") {
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
              {user?.ts &&
                `${convertToCostaRicaTime(user.ts).fechaFormatted} ${convertToCostaRicaTime(user.ts).horaFormatted}`}
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

  // type === "agregado"
  return (
    <Modal open={open} onClose={onClose} size="md" title="Foto de usuario">
      <div className="flex flex-col items-center gap-4">
        {user?.foto_url && (
          <img
            src={
              user.foto_url
                ? `${api}/${user.foto_url.replace(/^\/+/, "")}`
                : `${imagen}`
            }
            alt={user?.nombre || ""}
            className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl object-cover border-2 border-[#303036] shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `${imagen}`;
            }}
          />
        )}
        <div className="text-center text-white space-y-2 w-full">
          <h3 className="text-lg font-semibold">{user?.nombre}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-400">Cédula:</p>
              <p className="text-white break-words">{user?.cedula || "N/A"}</p>
            </div>
            <div>
              <p className="text-neutral-400">Email:</p>
              <p className="text-white break-words">{user?.email || "N/A"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-neutral-400">Teléfono:</p>
              <p className="text-white">{user?.telefono || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PersonaPhotoModal;