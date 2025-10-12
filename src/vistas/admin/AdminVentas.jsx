import { useEffect, useState } from "react";
import { adminUpdatePedido, getPedidosAdmin } from "../../api/proPulseApi";
import { useAuth } from "../../contexts/AuthContext";
import { useFadeUp } from "../../customHooks/useFadeUp";
import { formatoCPL } from "../../utils/helpers";

export default function AdminVentas() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  useFadeUp();

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPedidosAdmin();
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

  const cambiarEstado = async (id_pedido, nuevoEstado) => {
    try {
      const updated = await adminUpdatePedido(id_pedido, nuevoEstado);
      // Si el backend devuelve { message, pedido }, usa el pedido:
      const pedidoActualizado = updated?.pedido || updated;

      setPedidos((prev) =>
        prev.map((p) =>
          p.id_pedido === id_pedido
            ? { ...p, ...pedidoActualizado } // fusiona campos
            : p
        )
      );

      setMsg("✅ Estado actualizado correctamente");
      setTimeout(() => setMsg(""), 2000);
    } catch (e) {
      console.error("Error al actualizar estado:", e);
      setError(
        (e?.status ? `(${e.status}) ` : "") +
          (e?.error || "No se pudo actualizar el estado")
      );
    }
  };

  return (
    <>
      <h2 className="text-gradient-primary mt-2">Ventas (historial)</h2>
                    <div className="glass p-05 bg-gradient-primary fade-up visible">

    <div className="glass2 radius text-shadow p-1">

      {loading && <p>Cargando…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {msg && <p className="text-green-500">{msg}</p>}
      {!loading && !pedidos.length && <p>Sin pedidos.</p>}

      <div className="flex flex-col gap-2">
        {pedidos.map((p) => (
          <div key={p.id_pedido} className="border rounded pl-1 w-full">
            <div className="flex justify-between w-full items-center">
              <div>
                <p>
                  <b>Pedido #{p.id_pedido}</b> ·{" "}
                  {new Date(p.fecha_creacion).toLocaleString()}
                </p>
                <p>
                  Estado: <b>{p.estado}</b> · Total:{" "}
                  <b>{formatoCPL.format(p.total_pedido)}</b>
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={p.estado}
                  onChange={(e) => cambiarEstado(p.id_pedido, e.target.value)}
                  className="border rounded p-05 radius"
                  >
                  <option value="pendiente">pendiente</option>
                  <option value="pagado">pagado</option>
                  <option value="enviado">enviado</option>
                  <option value="entregado">entregado</option>
                  <option value="cancelado">cancelado</option>
                </select>
              </div>
            </div>

            {Array.isArray(p.items_pedido) && p.items_pedido.length > 0 && (
              <div className="p-05 bg-silver radius">
              <div className="glass p-1 text-black shadow-none">
                <table className="w-full text-start">
                  <thead className=" text-start">
                    <tr>
                      <th className="text-left">Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody className="text-start">
                    {p.items_pedido.map((d) => (
                      <tr key={d.id_detalle} className="text-start">
                        <td>
                          #{d.id_producto} {d.titulo}
                        </td>
                        <td className="text-center">{d.cantidad}</td>
                        <td className="text-center">
                          ${d.precio_fijo?.toLocaleString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
            </>
  );
}
