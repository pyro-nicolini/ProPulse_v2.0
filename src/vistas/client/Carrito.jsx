// src/componentes/Carrito.jsx
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import ConfirmButtonCart from "../../componentes/ConfirmButtonCart";
import { formatoCPL, resolveImg } from "../../utils/helpers"; // 👈 usamos el helper mejorado
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
    <div className="w-full justify-center items-center fondo1 border-gold m-auto">
      {itemsOrdenadosPorId.map((it) => {
        const stockDisponible = it?.stock - it?.cantidad;

        const fallback =
          it?.tipo === "servicio"
            ? resolveImg("servicio1_1.webp", "servicio")
            : resolveImg("producto1_1.webp", "producto");

        const imageUrl =
          resolveImg(it.url_imagen, it.tipo) || fallback;

        return (
          <div
            key={it.id_item}
            className="p-05 radius w-full fade-up visible w-full flex-col"
          >
            <div className="bg-gradient-primary p-05 radius w-full container-600 text-shadow">

            <div
              className="glass pl-2 h-min radius w-full"
            >
              <div className=" text-start flex justify-start gap-05">

              <h5 className="font-bold p-05 flex m-0 flex-wrap">
                {it?.titulo.split(" ").slice(0, 3).join(" ")}
                </h5>
                                      <Link
                      className=" bg-silver text-white radius p-05 text-small2"
                      to={
                        it.tipo === "producto"
                        ? `/productos/${it.id_producto}`
                            : `/servicios/${it.id_producto}`
                          }
                          >
                        Ver {it.tipo}
                      </Link>
                                            <p className="text-small bg-black radius p-05 m-0">
                        ID: SKU000{it?.id_producto}
                      </p>

                        </div>

              <div className="flex justify-between">
                <div>
                  <div className="flex justify-start items-center gap-05">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={it?.titulo || ""}
                        className="w-sm h-sm radius object-cover"
                        onError={(e) => {
                          e.target.src = fallback;
                        }}
                      />
                    )}

                    <div className="flex-col">

                      {loadingProducto && <p>(cargando…)</p>}

                      <h4 className="text-start flex justify-start">
                        {formatoCPL.format(it?.precio_fijo)} 🛒
                      </h4>

                      {it?.tipo === "producto" && (
                        <strong
                          style={{
                            color: stockDisponible < 6 ? "red" : "white",
                          }}
                        >
                          Stock: {stockDisponible}
                        </strong>
                      )}
                    </div>
                  </div>

                  <div className="pb-1 mt-1">
                    {it?.tipo === "servicio" ? (
                      <strong>Cantidad: 1</strong>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="btn-danger shadow"
                          onClick={() =>
                            it?.cantidad > 1
                              ? removeItem(carrito?.id_carrito, it.id_producto)
                              : null
                          }
                        >
                          -
                        </button>
                        <strong>{it?.cantidad}</strong>
                        <button
                          className="btn-danger shadow"
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
                  </div>
                </div>

                <div className="flex items-center gap-1 justify-center">
                  <button
                    className="btn btn-secondary text-small text-shadow"
                    onClick={() =>
                      deleteItem(carrito?.id_carrito, it.id_producto)
                    }
                  >
                    Eliminar 🗑️
                  </button>
                </div>
              </div>
            </div>
                      </div>

          </div>
        );
      })}
      <ConfirmButtonCart />
    </div>
  );
}
