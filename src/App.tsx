import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './views/login/login'
import Home from './views/home/home'
import CustomDrawer from './drawer'
import ListaAgregados from './views/agregados/listaAgregados';
import FormuAgregados from './views/agregados/formAgregados';
import ListaIngresados from './views/ingresados/listaIngresados';
import { useState } from 'react';

function App() {
  const [isLogged, setIsLogged] = useState(false);

  // Si no está logueado, solo muestra el login
  if (!isLogged) {
    return <Login onLogin={() => setIsLogged(true)} />;
  }

  // Si está logueado, muestra el Drawer y las rutas internas
  return (
    <CustomDrawer onLogout={() => setIsLogged(false)}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/listaAgregados" element={<ListaAgregados />} />
      
        <Route path="/listaIngresados" element={<ListaIngresados />} />
        <Route path="/formAgregados" element={<FormuAgregados onSave={(data) => console.log('Saved data:', data)} />} />
      
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </CustomDrawer>
  );
}

export default App