import { useEffect, useState } from "react";
import { getMisPedidos, getPedido, adminUpdatePedido, getPedidosAdmin } 
  from "../../api/proPulseApi";
import { useAuth } from "../../contexts/AuthContext";
import { useFadeUp } from "../../customHooks/useFadeUp";

export default function AdminVentas() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [abiertos, setAbiertos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useFadeUp();
 const cargar = async () => {
  setLoading(true);
  setError("");
  try {
    const data = user?.rol === "admin"
      ? await getPedidosAdmin()
      : await getMisPedidos();
    setPedidos(Array.isArray(data) ? data : []);
  } catch (e) {
    setError(e?.error || "No se pudo cargar el historial");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user) cargar();
  }, [user?.id]);

  const toggleDetalle = async (id_pedido) => {
    if (abiertos[id_pedido]) {
      setAbiertos((prev) => {
        const c = { ...prev };
        delete c[id_pedido];
        return c;
      });
      return;
    }
    try {
      const ped = await getPedido(id_pedido);
      setAbiertos((prev) => ({ ...prev, [id_pedido]: ped.detalle || [] }));
    } catch {}
  };

const cambiarEstado = async (id_pedido, nuevoEstado) => {
  try {
    const updated = await adminUpdatePedido(id_pedido, { estado: nuevoEstado });
    setPedidos(prev =>
      prev.map(p =>
        p.id_pedido === id_pedido ? updated : p
      )
    );
  } catch (e) {
    setError(e?.error || "No se pudo actualizar el estado");
  }
};


  return (
    <div className="glass mt-1 fade-up">
      <h2 className="mb-2">Ventas (historial)</h2>
      {loading && <p>Cargando…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !pedidos.length && <p>Sin pedidos.</p>}

      <div className="flex flex-col gap-2">
        {pedidos.map((p) => (
          <div key={p.id_pedido} className="border rounded p-2 w-full">
            <div className="flex justify-between w-full items-center">
              <div>
                <p>
                  <b>Pedido #{p.id_pedido}</b> ·{" "}
                  {new Date(p.fecha_pedido).toLocaleString()}
                </p>
                <p>
                  Estado: <b>{p.estado}</b> · Total: <b>${p.total}</b>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn"
                  onClick={() => toggleDetalle(p.id_pedido)}
                >
                  {abiertos[p.id_pedido] ? "Ocultar detalle" : "Ver detalle"}
                </button>
                <select
                  value={p.estado}
                  onChange={(e) => cambiarEstado(p.id_pedido, e.target.value)}
                >
                  <option value="pendiente">pendiente</option>
                  <option value="pagado">pagado</option>
                  <option value="enviado">enviado</option>
                  <option value="entregado">entregado</option>
                  <option value="cancelado">cancelado</option>
                </select>
              </div>
            </div>

            {abiertos[p.id_pedido] && (
              <div className="card mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abiertos[p.id_pedido].map((d) => (
                      <tr key={d.id_detalle}>
                        <td>#{d.id_producto}</td>
                        <td className="text-center">{d.cantidad}</td>
                        <td className="text-right">${d.precio_fijo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
