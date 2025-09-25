import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatoCPL } from "../utils/helpers";

function ConfirmButtonCart() {
  const { carrito } = useCart();
  const [acepto, setAcepto] = useState(false);
  const navigate = useNavigate();

  const onConfirm = () => {
    if (!acepto || !carrito?.items_carrito.length) return;
    navigate("/checkout/resumen", { state: { items: carrito.items_carrito, total: carrito.total.total_carrito } });
  };

  return (
    <div className="container w-full">
      <div className="card w-full">
        <div>
          <p>
            sub_total:{" "}
            {formatoCPL.format(carrito?.total.sub_total)}
          </p>
          <p>
            I.V.A 19%:{" "}
            {formatoCPL.format(carrito?.total.impuestos)}
          </p>
          <p>
            Total:{" "}
            {formatoCPL.format(carrito?.total.total_carrito)}
          </p>
        </div>

        <label>
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
          />
          <span> Acepto términos y condiciones</span>
        </label>

        <button
          className="btn btn-primary w-full"
          onClick={onConfirm}
          disabled={!acepto || !carrito?.items_carrito.length}
        >
          Confirmar y continuar
        </button>
      </div>
    </div>
  );
}
export default ConfirmButtonCart;