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
      <div className="p-05 radius">
        <div className="p-05 radius bg-gradient-primary mb-2 fade-up visible">
          <div className="container-800 glass text-shadow shadow card-metal  w-full border-orange">
            <h3>
              Bienvenido,{" "}
              <strong className="text-gradient-primary shadow-none">
                {user?.nombre.split("")[0].toUpperCase() +
                  user?.nombre.slice(1)}
              </strong>
            </h3>
            <p>
              ID:
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.id}
              </strong>
            </p>
            <p>
              Email:
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.email}
              </strong>
            </p>
            <p>
              Rol:
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.rol}
              </strong>
            </p>
            <p>
              Registrado el:
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.fecha_creacion.split("T")[0]}
              </strong>
              a las
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.fecha_creacion.slice(11,19)}
              </strong>
            </p>
            <p>
              Última modificación:
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.fecha_modificacion.split("T")[0]}
              </strong>
              a las
              <strong className="text-gradient-primary shadow-none p-05">
                {user?.fecha_modificacion.slice(11,19)}
              </strong>
            </p>
          </div>
        </div>

        <div className="w-full container-800 fade-up visible">
        <Pedidos />
        </div>
        <div className="w-full container-800 fade-up visible">
          <Favoritos />
        </div>
      </div>
    </div>
  );
}
