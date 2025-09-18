import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function AgregarAlCarrito({
  product,
  qty = 1,
  children = "Agregar",
}) {
  const { items, addItem, updateItem } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const notify = (text, ms = 1600) => {
    setMsg(text);
    setTimeout(() => setMsg(""), ms);
  };

  const id_producto = Number(product?.id_producto ?? product?.id);
  const esServicio = product?.tipo === "servicio";
  const esProducto = product?.tipo === "producto";

  const existente = items.find((i) => Number(i.id_producto) === id_producto);
  const stock = Number.isFinite(product?.stock) ? Number(product.stock) : null;
  const enCarrito = Number(existente?.cantidad || 0);
  const stockDisponible = stock === null ? null : Math.max(0, stock - enCarrito);

  const sinStock = esProducto && stockDisponible !== null && stockDisponible <= 0;
  const servicioAgregado = esServicio && !!existente;
  const disabled = busy || sinStock || servicioAgregado;

  const onAdd = async () => {
    if (!user) return notify("Inicia sesión para agregar");
    if (!id_producto) return notify("Producto inválido");
    if (servicioAgregado) return notify("Servicio agregado");
    if (sinStock) return notify("Sin stock");

    const cantidadBase = esServicio ? 1 : Math.max(1, Number(qty) || 1);
    const cantidad = stockDisponible !== null
      ? Math.min(cantidadBase, stockDisponible)
      : cantidadBase;

    if (cantidad <= 0) return notify("Sin stock disponible");

    setBusy(true);
    try {
      if (existente) {
        await updateItem(existente.id_item, {
          cantidad: enCarrito + cantidad,
        });
        notify("Cantidad actualizada");
      } else {
        await addItem(id_producto, cantidad);
        notify(esServicio ? "Servicio agregado" : "Agregado al carrito");
      }
    } catch (e) {
      notify(e?.response?.data?.error || "No se pudo agregar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex gap-1 items-center">
        {esProducto && stock !== null && (
          <p className={`${sinStock ? "text-primary" : "text-gray-500"} subtitle m-0`}>
            {sinStock ? "Sin stock" : `Stock: ${stockDisponible}`}
          </p>
        )}

        <button
          className="btn btn-primary"
          onClick={onAdd}
          disabled={disabled}
          title="Agregar al carrito"
        >
          {busy
            ? "Agregando…"
            : servicioAgregado
            ? "Agregado"
            : sinStock
            ? "Sin stock"
            : `🛒 ${children}`}
        </button>
      </div>

      {msg && <p className="text-white text-center m-0">{msg}</p>}
    </>
  );
}
