import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatoCPL } from "../utils/helpers";

export default function ContadorCarrito() {
  const { items, totals } = useCart();
  const { user } = useAuth();
  const count = items.reduce((a, i) => a + (Number(i.cantidad) || 0), 0);

  if (!user) return null;

  return (
    <Link to="/carrito">
      <button className="btn btn-secondary">
        🛒 {count} — {formatoCPL.format(totals.subtotal || 0)}
      </button>
    </Link>
  );
}
