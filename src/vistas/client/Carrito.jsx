// src/componentes/Carrito.jsx
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import ConfirmButtonCart from "../../componentes/ConfirmButtonCart";
import { formatoCPL } from "../../utils/helpers";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { importImages } from "../../utils/helpers";

export default function Carrito() {
  const { carrito, addItem, removeItem, deleteItem } = useCart();
  const [loadingProducto, setLoadingProducto] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useFadeUp();

  const images = importImages();

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
        return (
          <div key={it.id_item} className="p-05 radius w-full fade-up visible w-full flex-col">
            <div style={{minWidth: "360px", maxWidth: "800px", width: "100%"}} className="metal pl-2 h-min">
                  <h5 className="font-bold text-start flex justify-start">
                    {it?.titulo.split(" ").slice(0, 3).join(" ")}
                  </h5>
              <div className="flex justify-between">
                <div>
                  <div className="flex justify-start items-center gap-05">
                    {it.url_imagen && images[it.url_imagen] && (
                      <img
                        src={images[it.url_imagen]}
                        alt=""
                        className="w-sm h-sm"
                      />
                    )}
                    <div className="flex-col">
                      {it?.tipo === "servicio" && (
                        <>
                          <p className="text-small m-0">
                            ID: SKU000{it?.id_producto}
                          </p>
                          
                                                      <Link
                              to={{
                                pathname:
                                  it.tipo === "producto"
                                    ? `/productos/${it.id_producto}`
                                    : `/servicios/${it.id_producto}`,
                              }}
                            >
                              Ver producto
                            </Link>
                          {loadingProducto && <p>(cargando…)</p>}
                          <h4 className="text-start flex justify-start">
                            {formatoCPL.format(it?.precio_fijo)} 🛒
                          </h4>
                        </>
                      )}
                      {it?.tipo === "producto" && (
                        <strong
                          style={{
                            color: stockDisponible < 6 ? "red" : "white",
                          }}
                        >
                          <p className="m-0 p-0">
                            <p className="text-small m-0">
                              ID: SKU000{it?.id_producto}
                            </p>
                            
                            <Link
                              to={{
                                pathname:
                                  it.tipo === "producto"
                                    ? `/productos/${it.id_producto}`
                                    : `/servicios/${it.id_producto}`,
                              }}
                            >
                              Ver producto
                            </Link>
                          </p>
                          Stock: {stockDisponible}
                          {loadingProducto && <p>(cargando…)</p>}
                          <h4 className="text-start flex justify-start">
                            {formatoCPL.format(it?.precio_fijo)} 🛒
                          </h4>
                        </strong>
                      )}
                    </div>
                  </div>
                  <div className="pb-1">
                  {it?.tipo === "servicio" ? (
                    <strong>Cantidad: 1</strong>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        className="ml-1 btn-danger"
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
                        className="ml-1 btn-danger"
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
                    className="btn btn-secondary text-small"
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
        );
      })}
      <ConfirmButtonCart />
    </div>
  );
}
