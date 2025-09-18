import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function Pedidos() {
  const { user } = useAuth();
  const { pedidos, fetchPedido, loading } = useCart();
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);

  const handleBuscarPedido = async (id) => {
    setDetalleLoading(true);
    const detalle = await fetchPedido(id);
    if (detalle && String(detalle.id_usuario) === String(user?.id)) {
      setPedidoDetalle(detalle);
    } else {
      setPedidoDetalle(null);
    }
    setDetalleLoading(false);
  };

  if (!user) return <div>Debes iniciar sesión para ver tus pedidos.</div>;
  if (loading) return <div>Cargando pedidos...</div>;
  if (!pedidos.length) return <div>No tienes pedidos.</div>;

  return (
    <div className="w-full">
      <h2>Mis Pedidos</h2>
      <table className="w-full container bg-gradient-secondary radius">
        <thead className="card w-full radius">
          <tr className="text-center">
            <th>ID Pedido</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id_pedido}>
              <td className="bg-white text-black text-center">{pedido.id_pedido}</td>
              <td className="bg-white text-black text-center">
                {pedido.fecha_pedido?.slice(0, 10)}
              </td>
              <td className="bg-white text-black text-center">
                ${pedido.total?.toLocaleString("es-CL")}
              </td>
              <td className="bg-white text-black text-center">{pedido.estado}</td>
              <td className="bg-white text-black text-center">
                <button
                  className="btn btn-primary p-0"
                  onClick={() => handleBuscarPedido(pedido.id_pedido)}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalleLoading && <div className="mt-4">Cargando detalle...</div>}
      {pedidoDetalle && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">
            Detalle del Pedido #{pedidoDetalle.id_pedido}
          </h3>
          <div>Estado: {pedidoDetalle.estado}</div>
          <div>Fecha: {pedidoDetalle.fecha_pedido?.slice(0, 10)}</div>
          <div>Total: ${pedidoDetalle.total?.toLocaleString("es-CL")}</div>
          <ul className="mt-2">
            {pedidoDetalle.items?.map((item, idx) => (
              <li key={idx}>
                {item.titulo || `Producto #${item.id_producto}`} x
                {item.cantidad} — ${item.subtotal?.toLocaleString("es-CL")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}