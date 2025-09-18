import { useAuth } from "../../contexts/AuthContext";
import Favoritos from "./Favoritos";
import Pedidos from "./Pedidos";

export default function PerfilCliente() {
  const { user } = useAuth();

  if (!user) return <p>No has iniciado sesión</p>;

  return (
    <div className="w-full flex flex-col bg-charcoal p-1">
      <div className="container-1200 card w-full mb-2">
      <h3>{user?.name}</h3>
      <p>ID: {user?.id}</p>
      <p>Email: {user?.email}</p>
      <p>Rol: {user?.rol}</p>
      <p>Registrado el: {user?.fecha_creacion}</p>
      </div>
      <div className="w-full container-1200">
        <Pedidos/>
        <div className="w-full container-1200">
          <Favoritos/>
        </div>
      </div>
    </div>
  );
}
