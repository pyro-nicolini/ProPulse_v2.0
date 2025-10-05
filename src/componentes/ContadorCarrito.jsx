import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatoCPL } from "../utils/helpers";

export default function ContadorCarrito() {
  const { carrito } = useCart();
  const { user } = useAuth();

  if (!user) return null;

  const items = carrito?.items_carrito || [];
  if (!items.length) {
  }

  const total_carrito = carrito?.total?.total_carrito || 0;

  return (
    <Link to="/carrito">
      <button style={{ fontSize: '.8rem' }} className="btn text-white p-05 rounded">
        🛒 {formatoCPL.format(total_carrito)}
      </button>
    </Link>
  );
}
