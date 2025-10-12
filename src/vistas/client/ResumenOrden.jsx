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
    return <p className="metal m-1 text-center p-1">Cargando carrito…</p>;
  const items = carrito.items_carrito || [];

  return (
    <div className="container-800 w-full p-1">
      <div className="p-1 bg-gradient-primary radius">
      <div className="glass text-shadow shadow w-full p-2 rounded shadow fade-up visible">
        <h3 className="text-xl font-bold mb-4">Resumen de tu orden</h3>
        <ul className="divide-y">
          {items.map((it) => (
            <li key={it.id_item} className="pt-1 flex justify-between">
              <span>
                {it.cantidad} x {it.titulo || `Producto #${it.id_producto}`}  {it.precio_fijo && `(${formatoCPL.format(it.precio_fijo)} c/u)`}
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
        <div className="mt-1 border-t pt-2">
          <div className="flex justify-between">
            <span>neto</span>
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
          className="btn btn-primary w-full mt-2 shadow"
          onClick={handleCheckout}
          disabled={busy || loading}
        >
          {busy ? "Procesando..." : "Confirmar pedido"}
        </button>
        {msg && <div className="mt-2 text-center text-red-600">{msg}</div>}
      </div>
      </div>
    </div>
  );
}
