import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResumenOrden() {
  const { items, totals, checkout, loading } = useCart();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

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

  if (!items.length) return <p>Tu carrito está vacío.</p>;

  return (
    <div className="container w-full">
      <div className="card rounded shadow">
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
                  it.subtotal || it.precio_fijo * it.cantidad
                ).toLocaleString("es-CL")}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totals.subtotal.toLocaleString("es-CL")}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (19%)</span>
            <span>${totals.iva.toLocaleString("es-CL")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totals.total.toLocaleString("es-CL")}</span>
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
