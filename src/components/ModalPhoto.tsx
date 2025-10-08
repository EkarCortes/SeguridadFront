import React from "react";
import Modal from "./Modal";
import api from "../config/apiconfig";

interface PersonaPhotoModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    foto_url?: string;
    nombre?: string;
    cedula?: string;
    email?: string;
    telefono?: string;
  } ;
}

const PersonaPhotoModal: React.FC<PersonaPhotoModalProps> = ({ open, onClose, user }) => {
  return (
    <Modal open={open} onClose={onClose} size="md" title="Foto de usuario">
      <div className="flex flex-col items-center gap-4">
        {user?.foto_url && (
          <img
            src={
              user.foto_url
                ? `${api}/${user.foto_url.replace(/^\/+/, "")}`
                : "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"
            }
            alt={user.nombre}
            className="w-64 h-64 rounded-xl object-cover border-2 border-[#303036] shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/256";
            }}
          />
        )}
        <div className="text-center text-white space-y-2">
          <h3 className="text-lg font-semibold">{user?.nombre}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-400">Cédula:</p>
              <p className="text-white">{user?.cedula || 'N/A'}</p>
            </div>
            <div>
              <p className="text-neutral-400">Email:</p>
              <p className="text-white">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-neutral-400">Teléfono:</p>
              <p className="text-white">{user?.telefono || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PersonaPhotoModal;