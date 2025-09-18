import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducto } from "../../api/proPulseApi";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import { formatoCPL } from "../../utils/helpers";

export default function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

  useFadeUp();
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const res = await getProducto(id);
        const data = res || res.data;
        if (!data || Object.keys(data).length === 0) {
          setError("Producto no encontrado");
          setProducto(null);
        } else {
          setProducto(data);
        }
      } catch (err) {
        setError("Error al cargar producto");
        setProducto(null);
      }
    })();
  }, [id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!producto) return <div>Cargando...</div>;

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
          <div>
            <AddToCartButton product={producto} />
          </div>
        </div>
      </div>
      <Resena />
    </>
  );
}
