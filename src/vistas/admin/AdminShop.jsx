// src/paginas/admin/AdminShop.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useShop } from "../../contexts/ShopContext";
import { useFadeUp } from "../../customHooks/useFadeUp";

export default function AdminShop() {
  const { user } = useAuth();
  const { productos, updateProduct, deleteProduct, putDestacado } = useShop();

  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useFadeUp();
  const notify = (t) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 1400);
  };

  const onGuardar = async (p) => {
    setBusy(true);
    try {
      const payload = {
        titulo: p.titulo,
        precio: Number(p.precio),
        stock: p.tipo === "producto" ? Number(p.stock) : null,
        activo: !!p.activo,
      };
      await updateProduct(p.id_producto, payload);
      notify("Guardado");
    } catch {
      notify("Error al guardar");
    } finally {
      setBusy(false);
    }
  };

  const onBorrar = async (p) => {
    if (!confirm("¿Desactivar producto?")) return;
    setBusy(true);
    try {
      await deleteProduct(p.id_producto);
      notify("Desactivado");
    } catch {
      notify("Error al desactivar");
    } finally {
      setBusy(false);
    }
  };

  const toggleDestacado = async (p) => {
    setBusy(true);
    try {
      await putDestacado(p.id_producto, !p.destacado);
    } finally {
      setBusy(false);
    }
  };

  const onChangeItem = (id, key, val) => {
    updateProduct(id, { [key]: val });
  };

  const filtrados = productos.filter((p) =>
    p.titulo.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container glass p-1 w-full mt-1 fade-up">
      <h2 className="mb-2">Admin Shop</h2>
      {user?.rol !== "admin" && <p>No autorizado.</p>}
      {user?.rol === "admin" && (
        <>
          <div className="grid-col-1 grid gap-3 w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título…"
              className="input flex-1"
            />
          </div>
          {msg && <p className="text-sm opacity-80">{msg}</p>}
          <div className="grid-col-1 grid w-full p-1">
            {filtrados.map((p) => (
              <div key={p.id_producto} className="card p-2 bg-black radius">
                <div className="grid-col-1 grid gap-3 items-start">
                  <img
                    src={p.url_imagen}
                    width={72}
                    height={48}
                    alt=""
                    className="rounded"
                  />
                  <div className="flex-1">
                    <input
                      className="input w-full"
                      value={p.titulo}
                      onChange={(e) =>
                        onChangeItem(p.id_producto, "titulo", e.target.value)
                      }
                    />
                    <div className="grid-col-1 grid gap-3 mt-1">
                      <label>
                        Precio
                        <input
                          type="number"
                          className="input ml-1 w-28"
                          value={p.precio}
                          onChange={(e) =>
                            onChangeItem(
                              p.id_producto,
                              "precio",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label>
                        Stock
                        <input
                          type="number"
                          className="input ml-1 w-20"
                          disabled={p.tipo !== "producto"}
                          value={p.tipo === "producto" ? p.stock ?? 0 : ""}
                          onChange={(e) =>
                            onChangeItem(
                              p.id_producto,
                              "stock",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!p.destacado}
                          onChange={() => toggleDestacado(p)}
                        />{" "}
                        Destacado
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={!!p.activo}
                          onChange={(e) =>
                            onChangeItem(
                              p.id_producto,
                              "activo",
                              e.target.checked
                            )
                          }
                        />{" "}
                        Activo
                      </label>
                    </div>
                  </div>
                  <div className="grid-col-1 grid gap-3 w-full">
                    <button
                      className="btn"
                      onClick={() => onGuardar(p)}
                      disabled={busy}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => onBorrar(p)}
                      disabled={busy}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
                <p className="text-sm opacity-75 mt-1">
                  #{p.id_producto} · {p.tipo} · likes: {p.likes_count ?? 0}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
