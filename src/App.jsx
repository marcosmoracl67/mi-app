// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react"; 

// --- Importa tus componentes existentes ---
import LoginForm from "./components/LoginForm";
import Sidebar from "./components/Sidebar"; // Sidebar de Menú Hamburguesa
import DevBanner from "./components/DevBanner";
import PrivateRoute from "./auth/PrivateRoute"; // Tu HOC PrivateRoute actual

// --- Importa los NUEVOS componentes para el layout de jerarquía ---
import ResizablePanel from "./components/ResizablePanel";
import JerarquiaManager from "./pages/hierarchy/JerarquiaManager";

// Páginas protegidas (asegúrate que todas estén importadas)
import Usuarios from "./pages/admin/Usuarios";
import Empresas from "./pages/admin/Empresas";
import Roles from "./pages/admin/Roles";
import MenuCategorias from "./pages/admin/MenuCategorias";
import MenuOpciones from "./pages/admin/MenuOpciones";
import PermisosMenu from "./pages/admin/PermisosMenu";
import Logs from "./pages/admin/Logs";
import Contexto from "./pages/admin/Contexto";
import Demo from "./pages/admin/FormDemo";
import TiposNodo from "./pages/hierarchy/TiposNodo"; 
import PaginaGestionJerarquia from "./pages/hierarchy/PaginaGestionJerarquia"; 
import Tablero from "./pages/projects/Proyectos";
import Detalle from "./pages/projects/ProyectoDetalle";
import Dashboard from "./pages/projects/Dashboard";
import Listas from "../src/pages/hierarchy/Listas"; 
import DetalleNodo from "./pages/hierarchy/DetalleNodo"; 
import EstadoOperativo from "./pages/hierarchy/EstadoOperativo"; 
import ModoFalla from "./pages/hierarchy/ModoFalla"; 

import InspeccionTabsWrapper from "./pages/inspecciones/InspeccionTabsWrapper";

// --- Importa los componentes de Auth (si no estaban ya) ---
import InitiateReset from "./auth/InitiateReset";
import ChooseMethod from "./auth/ChooseMethod";
import CodeVerification from "./auth/CodeVerification";
import PasswordResetForm from "./auth/PasswordResetForm";

const App = () => {
  // Estado para el Sidebar de Menú Hamburguesa (se mantiene aquí)
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(true);

  // --- Helper ProtectedLayout MODIFICADO ---
  const ProtectedLayout = ({ children, showHierarchyPanel = false }) => (
    <PrivateRoute> {/* Envolvemos con tu HOC PrivateRoute para la lógica de autenticación */}
      <>
        <Sidebar open={menuSidebarOpen} setOpen={setMenuSidebarOpen} /> {/* Sidebar de Menú */}
        <div className={`app-main ${menuSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          {showHierarchyPanel ? (
            // Layout CON panel de jerarquía
            <div className="page-layout-with-hierarchy">
              <ResizablePanel
                initialWidth={280} // Ancho inicial del panel de jerarquía
                minWidth={200}
                maxWidth={700} // Puedes ajustar esto
                side="left"
                className="hierarchy-panel-wrapper" // Para estilos adicionales si son necesarios
              >
                <JerarquiaManager />
              </ResizablePanel>
              <main className="main-content-area" role="main">
                {children} {/* Contenido específico de la ruta (a la derecha de la jerarquía) */}
              </main>
            </div>
          ) : (
            // Layout SIN panel de jerarquía (el contenido ocupa todo el app-main)
             <div className="main-content-area--full"> {/* O simplemente {children} si ya tiene padding y scroll */}
                {children}
             </div>
          )}
        </div>
      </>
    </PrivateRoute>
  );

  return (
    <div className="app-container">
      <Routes>
        {/* --- Ruta Pública --- */}
        <Route path="/login" element={<LoginForm />} />

        {/* --- Rutas Protegidas --- */}
        {/* Usando ProtectedLayout y pasando 'showHierarchyPanel' donde sea necesario */}

        <Route
          path="/home"
          element={<ProtectedLayout showHierarchyPanel={false}><div className="placeholder-content">Contenido de Home</div></ProtectedLayout>}
        />
        <Route
          path="/usuarios"
          element={<ProtectedLayout showHierarchyPanel={false}><Usuarios /></ProtectedLayout>}
        />
        <Route
          path="/empresas"
          element={<ProtectedLayout showHierarchyPanel={false}><Empresas /></ProtectedLayout>}
        />
        <Route
          path="/roles"
          element={<ProtectedLayout showHierarchyPanel={false}><Roles /></ProtectedLayout>}
        />
        <Route
          path="/menu-categorias"
          element={<ProtectedLayout showHierarchyPanel={false}><MenuCategorias /></ProtectedLayout>}
        />
        <Route
          path="/menu-opciones"
          element={<ProtectedLayout showHierarchyPanel={false}><MenuOpciones /></ProtectedLayout>}
        />
        <Route
          path="/permisos-menu"
          element={<ProtectedLayout showHierarchyPanel={false}><PermisosMenu /></ProtectedLayout>}
        />
        <Route
          path="/contexto"
          element={<ProtectedLayout showHierarchyPanel={false}><Contexto /></ProtectedLayout>}
        />
        <Route
          path="/tablero"
          element={<ProtectedLayout showHierarchyPanel={false}><Tablero /></ProtectedLayout>}
        />
        <Route
          path="/tiponodo"
          element={<ProtectedLayout showHierarchyPanel={false}><TiposNodo /></ProtectedLayout>}
        />
        <Route
          path="/dashboard"
          element={<ProtectedLayout showHierarchyPanel={false}><Dashboard /></ProtectedLayout>}
        />
        <Route
          path="/proyectos/:id"
          element={<ProtectedLayout showHierarchyPanel={false}><Detalle /></ProtectedLayout>}
        />
        <Route
          path="/logs"
          element={<ProtectedLayout showHierarchyPanel={false}><Logs /></ProtectedLayout>}
        />
        <Route
          path="/formdemo"
          element={<ProtectedLayout showHierarchyPanel={false}><Demo /></ProtectedLayout>}
        />
         <Route
          path="/listas"
          element={<ProtectedLayout showHierarchyPanel={false}><Listas /></ProtectedLayout>}
        />
         <Route
          path="/detallenodo"
          element={<ProtectedLayout showHierarchyPanel={false}><DetalleNodo /></ProtectedLayout>}
        />
        <Route
          path="/estadoopertaivo"
          element={<ProtectedLayout showHierarchyPanel={false}><EstadoOperativo /></ProtectedLayout>}
        />
        <Route
          path="/modofalla"
          element={<ProtectedLayout showHierarchyPanel={false}><ModoFalla /></ProtectedLayout>}
        />
        {/* <Route
          path="/inspecciones"
          element={<ProtectedLayout showHierarchyPanel={false}><InspeccionForm /></ProtectedLayout>}
        /> */}
        <Route
          path="/inspecciones"
          element={<ProtectedLayout showHierarchyPanel={false}><InspeccionTabsWrapper /></ProtectedLayout>}
        />
        <Route
          path="/jerarquia"
          element={
            <ProtectedLayout> {/* Mantenemos el Sidebar de menú y app-main */}
              <PaginaGestionJerarquia />
            </ProtectedLayout>
          }
        />

        {/* --- Rutas de Recuperación de Contraseña --- */}
        <Route path="/recuperar/inicio" element={<InitiateReset />} />
        <Route path="/recuperar/elegir-metodo" element={<ChooseMethod />} />
        <Route path="/recuperar/verificar" element={<CodeVerification />} />
        <Route path="/recuperar/nueva" element={<PasswordResetForm />} />
        <Route path="/recuperar" element={<Navigate to="/recuperar/inicio" replace />} />

        {/* --- Ruta por Defecto / Fallback --- */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <DevBanner />
    </div>
  );
};

export default App;