import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useShop } from "../../contexts/ShopContext";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { resolveImg } from "../../utils/helpers";

export default function AdminShop() {
  const { user } = useAuth();
  const {
    productos,
    refreshProductos,
    deleteProduct,
    updateProduct,
    loading,
    error,
  } = useShop();

  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [drafts, setDrafts] = useState({}); // { [id]: { titulo, descripcion, stock, tipo, url_imagen, precio, activo, destacado } }

  useFadeUp();
  const notify = (t) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 1500);
  };

  // Inicializa drafts a partir de productos
  useEffect(() => {
    if (!Array.isArray(productos)) return;
    setDrafts((prev) => {
      const next = { ...prev };
      for (const p of productos) {
        if (!next[p.id_producto]) {
          next[p.id_producto] = {
            titulo: p.titulo ?? "",
            descripcion: p.descripcion ?? "",
            stock: p.tipo === "producto" ? p.stock ?? 0 : null,
            tipo: p.tipo ?? "producto",
            url_imagen: p.url_imagen ?? "",
            precio: p.precio ?? 0,
            activo: !!p.activo,
            destacado: !!p.destacado,
            likes_count: p.likes_count ?? 0,
          };
        }
      }
      return next;
    });
  }, [productos]);

  const onDraftChange = (id, key, val) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));

  const hayCambios = (p) => {
    const d = drafts[p.id_producto];
    if (!d) return false;
    return (
      d.titulo !== (p.titulo ?? "") ||
      d.descripcion !== (p.descripcion ?? "") ||
      Number(d.precio) !== Number(p.precio ?? 0) ||
      (d.tipo === "producto"
        ? Number(d.stock ?? 0) !== Number(p.stock ?? 0)
        : false) ||
      (d.tipo ?? "producto") !== (p.tipo ?? "producto") ||
      (d.url_imagen ?? "") !== (p.url_imagen ?? "")
    );
  };

  // Limpia el draft de un producto por id
  const clearDraft = (id) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const onGuardar = async (p) => {
    const d = drafts[p.id_producto] || {};
    setBusy(true);
    try {
      const payload = {
        id_producto: p.id_producto,
        titulo: d.titulo,
        descripcion: d.descripcion ?? p.descripcion ?? "",
        stock: p.tipo === "producto" ? Number(d.stock) : null,
        tipo: p.tipo,
        url_imagen: d.url_imagen || null,
        precio: Number(d.precio),
      };
      await updateProduct(p.id_producto, payload);
      await refreshProductos();
      clearDraft(p.id_producto);
      notify("✅ Guardado");
    } catch (err) {
      console.error("Error guardando:", err);
      notify("❌ Error al guardar");
    } finally {
      setBusy(false);
    }
  };

  const onCancelar = (p) => {
    setDrafts((prev) => ({
      ...prev,
      [p.id_producto]: {
        titulo: p.titulo ?? "",
        descripcion: p.descripcion ?? "",
        stock: p.tipo === "producto" ? p.stock ?? 0 : null,
        tipo: p.tipo ?? "producto",
        url_imagen: p.url_imagen ?? "",
        precio: p.precio ?? 0,
        activo: !!p.activo,
        destacado: !!p.destacado,
      },
    }));
    notify("↩️ Cambios descartados");
  };

  const onBorrar = async (p) => {
    if (!confirm(`¿Eliminar "${p.titulo}"?`)) return;
    setBusy(true);
    try {
      await deleteProduct(p.id_producto);
      notify("🗑️ Producto eliminado");
    } catch {
      notify("❌ Error al eliminar");
    } finally {
      setBusy(false);
    }
  };

  // Eliminado: no se crean productos desde aquí
  const filtrados = useMemo(
    () =>
      (productos || [])
        .filter((p) => (p.titulo || "").toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => Number(a.id_producto) - Number(b.id_producto)),
    [productos, q]
  );

  if (!user || user.rol !== "admin")
    return <p className="text-red text-center mt-3">⛔ No autorizado.</p>;

  return (
    <>
      <h2 className="mt-2 text-gradient-primary">Admin Shop</h2>
                        <div className="glass p-05 bg-gradient-primary fade-up visible">

    <div className="w-full glass p-1">

      <div className="flex gap-1 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar producto..."
          className="input flex-1 h-sm p-1 w-full"
        />
        <button
          className="btn btn-secondary"
          onClick={refreshProductos}
          disabled={busy}
        >
          🔄 Refrescar
        </button>
      </div>

      {msg && <p className="text-sm opacity-80">{msg}</p>}
      {loading && <p className="text-sm">Cargando productos...</p>}
      {error && <p className="text-red text-sm">Error: {error.message}</p>}

      <div className="grid-col-1 grid w-full mt-1 mb-1">
        {filtrados.map((p) => {
          const d = drafts[p.id_producto] || {};
          const preview =
            resolveImg(d.url_imagen || p.url_imagen, d.tipo || p.tipo) ||
            resolveImg(
              (d.tipo || p.tipo) === "servicio"
                ? "servicio1_1.webp"
                : "producto1_1.webp",
              d.tipo || p.tipo
            );

          return (
            <div key={p.id_producto} className="card-metal bg-silver shadow text-shadow radius">
              <div className="grid grid-cols-1 gap-1 items-start p-1">
                <img
                  src={preview}
                  width={90}
                  height={60}
                  alt={d.titulo || p.titulo}
                  className="radius border object-cover"
                  onError={(e) => {
                    e.target.src = resolveImg(
                      (d.tipo || p.tipo) === "servicio"
                        ? "servicio1_1.webp"
                        : "producto1_1.webp",
                      d.tipo || p.tipo
                    );
                  }}
                />
                  <div className="flex flex-col gap-2">
                    <input
                      className="input w-full"
                      value={d.titulo ?? ""}
                      onChange={(e) =>
                        onDraftChange(p.id_producto, "titulo", e.target.value)
                      }
                      placeholder="Título"
                    />

                    <textarea
                      className="input w-full"
                      rows={3}
                      value={d.descripcion ?? ""}
                      onChange={(e) =>
                        onDraftChange(
                          p.id_producto,
                          "descripcion",
                          e.target.value
                        )
                      }
                      placeholder="Descripción"
                    />

                    <div className="flex-col gap-1 items-center w-full">
                      <label className="text-sm w-full">
                        Precio{" "}
                        <input
                          type="number"
                          className="input  w-full"
                          value={d.precio ?? 0}
                          onChange={(e) =>
                            onDraftChange(
                              p.id_producto,
                              "precio",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label className="text-sm w-full">
                        Stock{" "}
                        <input
                          type="number"
                          className="input w-full"
                          disabled={(d.tipo || p.tipo) !== "producto"}
                          value={
                            (d.tipo || p.tipo) === "producto"
                              ? d.stock ?? 0
                              : ""
                          }
                          onChange={(e) =>
                            onDraftChange(
                              p.id_producto,
                              "stock",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label className="text-sm w-full">
                        Tipo{" "}
                        <select
                          className="input  w-full"
                          value={d.tipo ?? "producto"}
                          onChange={(e) => {
                            const newTipo = e.target.value;
                            onDraftChange(p.id_producto, "tipo", newTipo);
                            if (newTipo !== "producto")
                              onDraftChange(p.id_producto, "stock", null);
                          }}
                        >
                          <option value="producto">producto</option>
                          <option value="servicio">servicio</option>
                        </select>
                      </label>

                      <label className="text-sm flex items-center gap-1 w-full">
                        Img{" "}
                        <input
                          className="input ml-1 w-64 w-full"
                          placeholder="producto1_1.webp o https://…"
                          value={d.url_imagen ?? ""}
                          onChange={(e) =>
                            onDraftChange(
                              p.id_producto,
                              "url_imagen",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {hayCambios(p) && (
                    <p className="text-xs text-yellow-400 mt-1">
                      • Cambios sin guardar
                    </p>
                  )}
                </div>

                <div className="flex flex-col-responsive gap-2 justify-center p-1">
                  <button
                    className="btn btn-primary shadow"
                    onClick={() => onGuardar(p)}
                    disabled={busy || !hayCambios(p)}
                  >
                    Guardar
                  </button>
                  <button
                    className="btn btn-secondary shadow"
                    onClick={() => onCancelar(p)}
                    disabled={busy || !hayCambios(p)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger shadow"
                    onClick={() => onBorrar(p)}
                    disabled={busy}
                  >
                    Borrar
                  </button>
              </div>

              <p className="text-xs opacity-70 mt-1">
                #{p.id_producto} · {d.tipo || p.tipo} · Likes:{" "}
                {typeof p.likes_count !== "undefined"
                  ? p.likes_count
                  : d.likes_count ?? 0}
              </p>
            </div>
          );
        })}
      </div>
    </div>
    </div>
        </>

  );
}
