import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useShop } from "../../contexts/ShopContext";
import { useResenas } from "../../contexts/ResenasContext";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { resolveImg } from "../../utils/helpers";

export default function AdminPublicaciones() {
  const { user } = useAuth();
  const { productos, fetchProductos, loading, totalLikes } = useShop();
  const { resenas, obtenerResenas } = useResenas();
  const [q, setQ] = useState("");

  useFadeUp();

  // 🔹 Cargar productos y reseñas al inicio
  const cargar = async () => {
    await fetchProductos({ q });
    await obtenerResenas();
  };

  useEffect(() => {
    if (user?.rol === "admin") cargar();
  }, [user?.id]);

  // 🔹 Cruza productos con reseñas (filtrado rápido)
  const productosConResenas = useMemo(() => {
    if (!Array.isArray(productos) || !Array.isArray(resenas)) return [];
    return productos.map((p) => ({
      ...p,
      totalResenas: resenas.filter((r) => r.id_producto === p.id_producto).length,
    }));
  }, [productos, resenas]);

  if (!user) return <p className="container m-3">No has iniciado sesión.</p>;
  if (user.rol !== "admin")
    return <p className="container m-4 p-1">Solo para administradores.</p>;

  return (
    <>
        <h2 className="text-gradient-primary mt-2">Admin Publicaciones</h2>
    <div className="glass mt-1 fade-up visible p-1">
      <div className="ap-toolbar mb-2 p-1">
        <div className="ap-actions">
          <input
            className="input"
            style={{ flex: 1, minWidth: 0 }}
            placeholder="Buscar por título…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            />
          <button className="btn" onClick={cargar} disabled={loading}>
            {loading ? "Cargando…" : "Refrescar"}
          </button>
        </div>
      </div>

      <div className="ap-stats bg-charcoal radius text-sm opacity-80 mb-2 p-2">
        <span>
          Productos: <b>{productos.length}</b>
        </span>
        <span>
          Likes totales: <b>{totalLikes}</b>
        </span>
        <span>
          Reseñas totales: <b>{resenas.length}</b>
        </span>
      </div>

      <div className="border rounded ap-table-wrap">
        <table className="ap-table text-sm ap-sticky">
          <thead>
            <tr className="bg-black">
              <th className="text-left p-2">Producto</th>
              <th className="text-left p-2 ap-col-hide-sm">Tipo</th>
              <th className="text-right p-2">Precio</th>
              <th className="text-center p-2">Stock</th>
              <th className="text-center p-2 ap-col-hide-sm">Reseñas</th>
              <th className="text-center p-2">Likes</th>
              <th className="text-center p-2 ap-col-hide-sm">Estado</th>
            </tr>
          </thead>
          <tbody>
            {productosConResenas.map((p) => {
              const isServicio = p.tipo === "servicio" || p.stock === null;
              const imgSrc =
              resolveImg(p.url_imagen, p.tipo) ||
              resolveImg(
                isServicio ? "servicio1_1.webp" : "producto1_1.webp",
                p.tipo
              );
              
              return (
                <tr key={p.id_producto} className="border-t">
                  <td className="p-2">
                    <div className="ap-product">
                      <img
                        src={imgSrc}
                        alt={p.titulo}
                        className="ap-thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = resolveImg(
                            isServicio
                            ? "servicio1_1.webp"
                            : "producto1_1.webp",
                            p.tipo
                          );
                        }}
                        />
                      <div>
                        <div className="font-medium">{p.titulo}</div>
                        <div className="opacity-60">#{p.id_producto}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 ap-col-hide-sm">{p.tipo}</td>
                  <td className="p-2 text-right">
                    ${Number(p.precio).toLocaleString("es-CL")}
                  </td>
                  <td className="p-2 text-center">
                    {isServicio ? "∞" : p.stock ?? 0}
                  </td>
                  <td className="p-2 text-center ap-col-hide-sm">
                    {p.totalResenas > 0 ? (
                      <span className="text-green-400 font-semibold">
                        {p.totalResenas}
                      </span>
                    ) : (
                      <span className="opacity-60">0</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {Number(p.likes_count ?? 0)}
                  </td>
                  <td className="p-2 text-center ap-col-hide-sm">
                    {p.activo ? (
                      <span className="text-green-600 font-semibold">
                        Activo
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactivo
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
              </>
  );
}
