import { useAuth } from "../../contexts/AuthContext";
import { useFadeUp } from "../../customHooks/useFadeUp";
import Favoritos from "./Favoritos";
import Pedidos from "./Pedidos";

export default function PerfilCliente() {
  const { user } = useAuth();
  useFadeUp();

  if (!user) return <p>No has iniciado sesión</p>;

  return (
    <div className="w-full flex flex-col bg-charcoal p-1">
      <div className="container-1200 metal card-metal  w-full mb-2 fade-up visible border-orange">
        <h3>{user?.nombre}</h3>
        <p>ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
        <p>Rol: {user?.rol}</p>
        <p>Registrado el: {user?.fecha_creacion}</p>
      </div>
      <div className="w-full container-1200 fade-up visible">
        <Pedidos />
        <div className="w-full container-1200 fade-up visible">
          <Favoritos />
        </div>
      </div>
    </div>
  );
}
