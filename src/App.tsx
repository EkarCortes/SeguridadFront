import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";

import Home from './views/home/home'
import CustomDrawer from './drawer'
import ListaAgregados from './views/agregados/listaAgregados';
import ListaIngresados from './views/ingresados/listaIngresados';

function AppContent() {

  return (
    <>
      <CustomDrawer onLogout={ async () => {} }>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/listaAgregados" element={<ListaAgregados />} />
          <Route path="/listaIngresados" element={<ListaIngresados />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </CustomDrawer>

      
    </>
  );
}

function App() {
  return (
      <AppContent />
  );
}

export default App