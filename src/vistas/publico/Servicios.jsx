import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProducto } from "../../api/proPulseApi";
import { useFadeUp } from "../../customHooks/useFadeUp";
import AddToCartButton from "../../componentes/AgregarAlCarrito";
import Resena from "../../componentes/Resena";
import { formatoCPL } from "../../utils/helpers";

export default function Servicio() {
  const { id } = useParams(); // /servicios/:id
  const [servicio, setServicio] = useState(null);

  const [error, setError] = useState(null);
  useFadeUp();
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const res = await getProducto(id);
        const data = res || res.data;
        if (!data || Object.keys(data).length === 0) {
          setError("servicio no encontrado");
          setServicio(null);
        } else {
          setServicio(data);
        }
      } catch (err) {
        setError("Error al cargar servicio");
        setServicio(null);
      }
    })();
  }, [id]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!servicio) return <div>Cargando...</div>;
  if (servicio.tipo !== "servicio") {
    return <div style={{ color: "red" }}>No es un servicio válido</div>;
  }
  return (
    <>
      <div className="w-full flex-col items-center justify-center bg-charcoal">
        <div style={{ maxWidth: "30rem" }} className="card fade-up visible m-1">
          <h4>{servicio?.titulo}</h4>
          <img
            className="img2 w-full"
            src={servicio?.url_imagen}
            alt={servicio?.titulo}
          />
          <h4 className="flex justify-end">
            {formatoCPL.format(servicio?.precio)}
          </h4>
          <p>{servicio?.descripcion}</p>
          <div>
            <AddToCartButton product={servicio} />
          </div>
        </div>
      </div>
      <Resena />
    </>
  );
}
