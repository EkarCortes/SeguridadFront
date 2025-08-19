import  { useState } from "react";
import AccessTable from "../../components/AccessTable";
import AccessChart from "../../components/AccessChart";

const CameraModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="
          bg-[#23232a] rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-center relative
          w-full max-w-[95vw] max-h-[95vh]
          min-w-[90vw] min-h-[60vw]
          sm:min-w-[400px] sm:min-h-[320px]
          md:min-w-[700px] md:min-h-[500px]
          "
        style={{ boxSizing: "border-box" }}
      >
        <button
          className="absolute top-2 right-2 text-neutral-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="w-72 h-56 md:w-96 md:h-72 bg-[#18181b] rounded-lg flex items-center justify-center border-2 border-dashed border-[#a3a3a3] mb-2 transition-all">
          <span className="text-neutral-400 text-lg">Cámara en vivo</span>
        </div>
        <span className="text-xs text-neutral-500">Sin señal de cámara</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Fila superior: gráfica y cámara */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Gráfica */}
          <div className="flex-1 bg-[#303036] rounded-lg shadow p-4 min-h-[370px] flex items-center justify-center">
            <AccessChart />
          </div>
          {/* Cámara en vivo */}
          <div className="w-full md:w-[350px] bg-[#313136] rounded-lg shadow p-4 min-h-[220px] flex flex-col items-center justify-center">
            <button
              className="w-32 h-24 bg-[#23232a] rounded-lg flex items-center justify-center mb-2 border-2 border-dashed border-[#a3a3a3] outline-none focus:ring-2 focus:ring-[#a3a3a3] transition"
              onClick={() => setModalOpen(true)}
              aria-label="Ampliar cámara"
            >
              <span className="text-neutral-400 text-sm">Cámara en vivo</span>
            </button>
            <span className="text-xs text-neutral-500 mb-2">Sin señal de cámara</span>
          </div>
        </div>
        {/* Fila inferior: tabla de accesos */}
        <div className="bg-white/5 rounded-lg shadow min-h-[220px] flex items-center justify-center w-full">
          <AccessTable />
        </div>
      </div>
      <CameraModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;