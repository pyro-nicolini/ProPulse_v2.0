import { useParams } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import { formatoCPL } from "../../utils/helpers";
import { useShop } from "../../contexts/ShopContext";
import { useState } from "react";

export default function Producto() {
  const { id } = useParams();
  const { productos } = useShop();
  const [error, setError] = useState(null);
  useFadeUp();

  const producto = productos.find((s) => {
    return s.id_producto === Number(id);
  });

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!producto) return <div>Cargando...</div>;
  if (producto.tipo !== "producto") {
    return <div style={{ color: "red" }}>No es un producto válido</div>;
  }
  return (
    <>
      <div className="w-full flex-col items-center justify-center bg-charcoal">
        <div style={{ maxWidth: "30rem" }} className="card fade-up visible m-1">
          <h4>{producto?.titulo}</h4>
          <img
            className="img2 w-full"
            src={producto?.url_imagen}
            alt={producto?.titulo}
          />
          <h4 className="flex justify-end">
            {formatoCPL.format(producto?.precio)}
          </h4>
          <p>{producto?.descripcion}</p>
          <p>{producto?.stock}</p>
          <div>
            <AddToCartButton product={producto} />
          </div>
        </div>
      </div>
      <Resena />
    </>
  );
}
