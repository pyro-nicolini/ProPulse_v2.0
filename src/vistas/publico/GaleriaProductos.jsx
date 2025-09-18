import { use, useEffect, useState } from "react";
import { getProductos } from "../../api/proPulseApi";
import { useFadeUp } from "../../customHooks/useFadeUp";
import Galeria from "../../componentes/Galeria";
import Destacados from "../../componentes/Destacados";

export default function GaleriaProductos() {
  const [productos, setProductos] = useState([]);
  useFadeUp();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductos({ tipo: "producto" });
        const data = res.data || res;
        setProductos(data.filter((p) => p.tipo === "producto"));
      } catch (error) {
      }
    })();
  }, []);

  const desordenarArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const productosBarajados = desordenarArray(productos).slice(0, 6);
  return (
    <>
      <div className="w-full">
        <div className="w-full container-1200 min-h-screen min-h-screen">

        <Galeria
          items={productosBarajados}
          title="Productos"
          routeBase="/productos"
          col={3}
          />
          </div>
        <div className="bg-charcoal w-full">
          <div className="w-full container-1200">
        <Destacados
          title="Destacados"
          col={3}
          routeBase="/productos"
          cant={3}
          tipoProducto="producto"
          />
          </div>
          </div>
      </div>
    </>
  );
}
