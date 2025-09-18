import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useShop } from "../../contexts/ShopContext";
import { useFadeUp } from "../../customHooks/useFadeUp";

export default function AdminPublicaciones() {
  const { user } = useAuth();
  const { productos, fetchProductos, loading } = useShop();
  const [q, setQ] = useState("");
  useFadeUp();
  const cargar = async () => {
    await fetchProductos({ q });
  };

  const totalLikes = useMemo(
    () => productos.reduce((acc, p) => acc + Number(p.likes_count ?? 0), 0),
    [productos]
  );

  if (!user) return <p className="container m-3">No has iniciado sesión.</p>;
  if (user.rol !== "admin")
    return <p className="container m-4">Solo para administradores.</p>;

  return (
    <div className="container glass mt-1 fade-up">
      <div className="ap-toolbar mb-2">
        <h3>Admin Publicaciones</h3>
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
            {productos.map((p) => {
              const isServicio = p.tipo === "servicio" || p.stock === null;
              return (
                <tr key={p.id_producto} className="border-t">
                  <td className="p-2">
                    <div className="ap-product">
                      <img
                        src={p.url_imagen}
                        alt=""
                        className="ap-thumb"
                        loading="lazy"
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
                    {Number(p.resenas_count ?? 0)}
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
  );
}
