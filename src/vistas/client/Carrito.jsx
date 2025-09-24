// src/componentes/Carrito.jsx
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import ConfirmButtonCart from "../../componentes/ConfirmButtonCart";
import { formatoCPL } from "../../utils/helpers";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Carrito() {
  const { carrito, addItem, removeItem, deleteItem } = useCart();
  const [loadingProducto, setLoadingProducto] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useFadeUp();

  if (!user)
    return (
  <Link to="/login">
  <p className="radius text-white bg-gradient-secondary m-1 text-center p-1">
          Debes iniciar sesión para ver el carrito 🛒💪
        </p>
      </Link>
    );
  if (!carrito)
    return <p className="card m-1 text-center p-1">Cargando carrito…</p>;

  const items = carrito.items_carrito || [];

  const itemsOrdenadosPorId = [...items].sort((a, b) => a.id_item - b.id_item);

  return (
    <div className="w-full flex justify-center items-center bg-charcoal">
      <div className="grid grid-cols-1">
        {itemsOrdenadosPorId.map((it) => {
          return (
            <div key={it.id_item} className="container w-full fade-up visible">
              <div
                className="card grid grid-cols-3 items-center gap-2"
                style={{ maxWidth: "600px" }}
              >
                <div>
                  <h4 className="font-bold">{it?.titulo}</h4>
                  <p>ID: {it?.id_producto}</p>
                  {it?.tipo === "servicio" && (
                    <p>(Servicio: solo 1 por carrito)</p>
                  )}
                  {loadingProducto && <p>(cargando…)</p>}
                  <p>{formatoCPL.format(it?.precio_fijo)} 🛒</p>
                  {it?.tipo === "producto" && <p>Stock: {it?.stock}</p>}
                </div>

                {it?.tipo === "servicio" ? (
                  <p>Cantidad: 1</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        it?.cantidad > 1
                          ? removeItem(carrito?.id_carrito, it.id_producto)
                          : null
                      }
                    >
                      -
                    </button>
                    <span>{it?.cantidad}</span>
                    <button
                      onClick={() =>
                        it?.cantidad < it?.stock
                          ? addItem(carrito?.id_carrito, it.id_producto)
                          : null
                      }
                    >
                      +
                    </button>
                  </div>
                )}

                <div className="text-right">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      deleteItem(carrito?.id_carrito, it.id_producto)
                    }
                  >
                    Eliminar 🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <ConfirmButtonCart />
      </div>
    </div>
  );
}
