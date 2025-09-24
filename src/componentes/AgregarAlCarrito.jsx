import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function AgregarAlCarrito({ product, children = "Agregar" }) {
  const { carrito, addItem } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const idProducto = product?.id_producto;
  const esServicio = product?.tipo === "servicio";
  const items = carrito?.items_carrito || [];
  const existente = items.find((i) => i.id_producto === idProducto);

  const cantidadEnCarrito = Number(existente?.cantidad || 0);
  const stockDisponible = Number.isFinite(product?.stock) ? product.stock : null;

  const handleAdd = async () => {
    if (!user || busy) 
      {
      setMsg("Inicia sesión para agregar");
      setTimeout(() => setMsg(""), 1000);
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await addItem(carrito.id_carrito, idProducto);
      setMsg(esServicio ? "Servicio agregado ✅" : "Producto agregado ✅");
    } catch (err) {
      setMsg("Error al agregar ❌");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 2000);
    }
  };

  // Lógica del botón
  let buttonText = `🛒 ${children}`;
  let disabled = busy;

  if (esServicio) {
    if (existente) {
      buttonText = "Agregado";
      disabled = true;
    } else if (busy) {
      buttonText = "Agregando…";
    }
  } else {
    if (stockDisponible !== null) {
      if (cantidadEnCarrito >= stockDisponible) {
        buttonText = "Agotado";
        disabled = true;
      } else if (busy) {
        buttonText = "Agregando…";
      }
    }
  }

  return (
    <>
      <div className="flex gap-1 items-center">
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={disabled}
          title="Agregar al carrito"
        >
          {buttonText}
        </button>
      </div>

      {msg && <p className="radius text-white text-center mt-1">{msg}</p>}
    </>
  );
}
