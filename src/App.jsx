import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Footer from "./componentes/Footer";
import Navbar from "./componentes/Navbar";
import ResenaForm from "./componentes/ResenaForm";

import Contacto from "./vistas/publico/Contacto";
import GaleriaProductos from "./vistas/publico/GaleriaProductos";
import GaleriaServicios from "./vistas/publico/GaleriaServicios";
import Home from "./vistas/publico/Home";
import Login from "./vistas/publico/Login";
import NotFound from "./vistas/publico/NotFound";
import Plantilla from "./vistas/publico/Plantilla";
import Producto from "./vistas/publico/Producto";
import Register from "./vistas/publico/Register";
import Servicio from "./vistas/publico/Servicios";

import CarritoPreOrden from "./vistas/client/Carrito";
import ConfirmacionOrden from "./vistas/client/ConfirmacionOrden";
import Favoritos from "./vistas/client/Favoritos";
import Pedidos from "./vistas/client/Pedidos";
import PerfilCliente from "./vistas/client/PerfilCliente";
import ResumenOrden from "./vistas/client/ResumenOrden";

import AdminProfile from "./vistas/admin/AdminProfile";
import AdminProductos from "./vistas/admin/AdminPublicaciones";
import AdminProductosForm from "./vistas/admin/AdminForm";
import AdminShop from "./vistas/admin/AdminShop";
import AdminVentas from "./vistas/admin/AdminVentas";

import AppProviders from "./AppProviders";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plantilla" element={<Plantilla />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<GaleriaProductos />} />
          <Route path="/productos/:id" element={<Producto />} />
          <Route path="/servicios" element={<GaleriaServicios />} />
          <Route path="/servicios/:id" element={<Servicio />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/checkout/resumen" element={<PrivateRoute roles={["admin", "cliente"]}><ResumenOrden /></PrivateRoute>} />
          <Route path="/checkout/orden-finalizada" element={<PrivateRoute roles={["admin", "cliente"]}><ConfirmacionOrden /></PrivateRoute>} />
          <Route path="/resena-form" element={<PrivateRoute roles={["admin", "cliente"]}><ResenaForm /></PrivateRoute>} />
          <Route path="/profile-user" element={<PrivateRoute roles={["admin", "cliente"]}><PerfilCliente /></PrivateRoute>} />
          <Route path="/pedidos/:id" element={<PrivateRoute roles={["admin", "cliente"]}><Pedidos /></PrivateRoute>} />
          <Route path="/favoritos" element={<PrivateRoute roles={["admin", "cliente"]}><Favoritos /></PrivateRoute>} />
          <Route path="/carrito" element={<CarritoPreOrden />} />

          <Route path="/admin-shop" element={<PrivateRoute roles={["admin"]}><AdminShop /></PrivateRoute>} />
          <Route path="/admin-ventas" element={<PrivateRoute roles={["admin"]}><AdminVentas /></PrivateRoute>} />
          <Route path="/admin-productos-form" element={<PrivateRoute roles={["admin"]}><AdminProductosForm /></PrivateRoute>} />
          <Route path="/admin-productos" element={<PrivateRoute roles={["admin"]}><AdminProductos /></PrivateRoute>} />
          <Route path="/admin-profile" element={<PrivateRoute roles={["admin"]}><AdminProfile /></PrivateRoute>} />
        </Routes>
        <Footer />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
