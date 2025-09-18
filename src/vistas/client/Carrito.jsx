// src/componentes/Carrito.jsx
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState } from "react";
import { getProducto } from "../../api/proPulseApi";
import ConfirmButtonCart from "../../componentes/ConfirmButtonCart";
import { formatoCPL } from "../../utils/helpers";

const stockNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const getStockProducto = (producto, it) => {
  const a = stockNumber(producto?.stock);
  const b = stockNumber(it?.stock);
  return a ?? b ?? Infinity;
};

export default function Carrito() {
  const { items, updateItem, removeItem, totals } = useCart();
  const [productos, setProductos] = useState({});

  useEffect(() => {
    if (!items.length) return;

    const faltantes = [...new Set(items.map((it) => it.id_producto))].filter(
      (id) => !(id in productos)
    );
    if (!faltantes.length) return;

    (async () => {
      const pares = await Promise.all(
        faltantes.map(async (id) => {
          try {
            const res = await getProducto(id);
            const data = res?.data ?? res;
            return [id, data ?? null];
          } catch {
            return [id, null];
          }
        })
      );
      setProductos((prev) =>
        Object.fromEntries([...Object.entries(prev), ...pares])
      );
    })();
  }, [items]);

  if (!items.length) {
    return (
      <div className="container w-full">
        <div className="card w-full text-center">
          <p>Tu carrito está vacío.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 bg-black w-full">
      <div></div>
      <div className="space-y-4">
        {items.map((it) => {
          const itemId =
            it.id_item ??
            it.id_detalle ??
            `${it.id_producto}-${it.precio_fijo ?? it.precio_unitario ?? it.precio ?? "x"}`;

          const producto = productos[it.id_producto];
          const loadingProducto = producto === undefined;
          const esServicio = (producto?.tipo ?? it.tipo) === "servicio";

          const cantidad = Math.max(1, Number(it.cantidad) || 1);
          const stockMax = getStockProducto(producto, it);
          const agotado = stockMax !== Infinity && cantidad >= stockMax;

          const incrementar = () => {
            if (esServicio) return;
            const nueva = stockMax === Infinity ? cantidad + 1 : Math.min(cantidad + 1, stockMax);
            if (nueva !== cantidad) updateItem(itemId, { cantidad: nueva });
          };

          const decrementar = () => {
            if (esServicio) return;
            const nueva = Math.max(1, cantidad - 1);
            if (nueva !== cantidad) updateItem(itemId, { cantidad: nueva });
          };

          const titulo = producto?.titulo || it.titulo || "Producto";
          const precioBase = it.precio_fijo ?? it.precio_unitario ?? it.precio ?? 0;

          return (
            <div key={itemId} className="container w-full">
              <div className="card grid grid-cols-3 items-center gap-2" style={{ maxWidth: "600px" }}>
                <div>
                  <h4 className="font-bold">{titulo}</h4>
                  <p>ID: {producto?.id_producto ?? it.id_producto}</p>
                  {esServicio && <p>(Servicio: solo 1 por carrito)</p>}
                  {loadingProducto && <p>(cargando…)</p>}
                  <p>{formatoCPL.format(precioBase)} 🛒</p>
                  {!esServicio && <p>Stock: {stockMax}</p>}
                </div>

                {esServicio ? (
                  <p>Cantidad: 1</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button onClick={decrementar} disabled={cantidad <= 1}>
                      -
                    </button>
                    <span>{cantidad}</span>
                    <button onClick={incrementar} disabled={agotado}>
                      +
                    </button>
                  </div>
                )}

                <div className="text-right">
                  <button
                    className="btn btn-secondary"
                    onClick={() => removeItem(itemId)}
                  >
                    Eliminar 🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <ConfirmButtonCart items={items} totals={totals} />
      </div>
    </div>
  );
}
