import { Link } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function ConfirmacionOrden() {
  const { pedidos } = useCart();
  const { user } = useAuth();
  useFadeUp();

  // Tomar el último pedido (más reciente)
  const pedido =
    Array.isArray(pedidos) && pedidos.length > 0
      ? pedidos[pedidos.length - 1]
      : pedidos && typeof pedidos === "object"
      ? pedidos
      : null;

  return (
    <div className="container flex flex-col items-center justify-center h-mid fade-up">
      <div className="card rounded shadow p-8 max-w-lg w-full text-center">
        <h3 className="text-2xl font-bold mb-4 text-green-700">
          Felicidades {user?.nombre || ""},<br />
          {pedido
            ? `Tu Pedido n°${
                pedido.id_pedido || pedido.id
              } ha sido confirmado! 🎉`
            : "tu pedido ha sido confirmado! 🎉"}
        </h3>
        {pedido ? (
          <>
            <p className="mb-2">
              Gracias por tu compra. Serás notificado a <br />
            </p>
              <h4 className="text-gradient-primary">
                <strong>
                  {user.email}
                </strong>
              </h4>
          </>
        ) : (
          <>
            <p className="mb-4">Tu pedido ha sido registrado correctamente.</p>
          </>
        )}
        <div className="flex flex-col-responsive gap-2">
          <Link to="/profile-user">
            <button className="btn btn-primary p-05">Ver MIS PEDIDOS</button>
          </Link>
          <Link to="/" className="btn btn-secondary p-05">
            Volver al HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
