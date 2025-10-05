import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { useAuth } from "../../contexts/AuthContext";
import { formatoCPL } from "../../utils/helpers";

export default function ResumenOrden() {
  const { carrito, checkout, loading } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  useFadeUp();

  const handleCheckout = async () => {
    setBusy(true);
    setMsg("");
    try {
      const pedido = await checkout();
      navigate("/checkout/orden-finalizada", { state: { order: pedido } });
    } catch (e) {
      setMsg("Error al confirmar el pedido.");
    } finally {
      setBusy(false);
    }
  };

 if (!user)
    return (
  <Link to="/login">
  <p className="radius text-white bg-gradient-secondary m-1 text-center p-1">
          Debes iniciar sesión para ver el carrito 🛒💪
        </p>
      </Link>
    );
  if (!carrito)
    return <p className="card-metal m-1 text-center p-1">Cargando carrito…</p>;
  const items = carrito.items_carrito || [];

  return (
    <div className="container w-full">
      <div className="card-metal rounded shadow fade-up">
        <h2 className="text-xl font-bold mb-4">Resumen de tu orden</h2>
        <ul className="divide-y">
          {items.map((it) => (
            <li key={it.id_item} className="py-2 flex justify-between">
              <span>
                {it.titulo || `Producto #${it.id_producto}`} x{it.cantidad}
              </span>
              <span>
                $
                {Number(
                  it.sub_total || it.precio_fijo * it.cantidad
                ).toLocaleString("es-CL")}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <span>sub_total</span>
            <span>{formatoCPL.format(carrito?.total.sub_total)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (19%)</span>
            <span>{formatoCPL.format(carrito?.total.impuestos)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatoCPL.format(carrito?.total.total_carrito)}</span>
          </div>
        </div>
        <button
          className="btn btn-primary w-full mt-6"
          onClick={handleCheckout}
          disabled={busy || loading}
        >
          {busy ? "Procesando..." : "Confirmar pedido"}
        </button>
        {msg && <div className="mt-2 text-center text-red-600">{msg}</div>}
      </div>
    </div>
  );
}
