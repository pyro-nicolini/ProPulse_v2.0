import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function ConfirmButtonCart() {
  const { items, totals } = useCart();
  const [acepto, setAcepto] = useState(false);
  const navigate = useNavigate();

  const onConfirm = () => {
    if (!acepto || !items.length) return;
    navigate("/checkout/resumen", { state: { items, totals } });
  };

  return (
    <div className="container w-full">
      <div className="card w-full">
        <div>
          <p>
            Subtotal:{" "}
            {totals.subtotal.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
          <p>
            Impuesto 19%:{" "}
            {totals.iva.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
          <p>
            Total:{" "}
            {totals.total.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
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
          disabled={!acepto || !items.length}
        >
          Confirmar y continuar
        </button>
      </div>
    </div>
  );
}
