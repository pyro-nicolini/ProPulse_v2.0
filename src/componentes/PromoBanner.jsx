import { useEffect, useState } from "react";

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    horas: 5,
    minutos: 43,
    segundos: 11,
  });

  // Simula el conteo regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { horas, minutos, segundos } = prev;
        if (segundos > 0) segundos--;
        else if (minutos > 0) {
          minutos--;
          segundos = 59;
        } else if (horas > 0) {
          horas--;
          minutos = 59;
          segundos = 59;
        }
        return { horas, minutos, segundos };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="promo-banner fade-up visible p-1">
      <div className="promo-header">
        <span className="cyber shadow">CYBERMONDAY</span>
        <h2 className="text-shadow">
          <strong>¡ÚLTIMAS HORAS!</strong> HASTA{" "}
          <span className="off">50% OFF</span>
        </h2>
        <p>🔥 ¡No las dejes pasar! 🔥</p>
      </div>

      <div className="timer">
        <div className="shadow">
          <h3 className="m-0">{String(timeLeft.horas).padStart(2, "0")}</h3>
          <p>HORAS</p>
        </div>
        <span>:</span>
        <div className="shadow">
          <h3 className="m-0">{String(timeLeft.minutos).padStart(2, "0")}</h3>
          <p>MINUTOS</p>
        </div>
        <span>:</span>
        <div className="shadow">
          <h3 className="m-0">{String(timeLeft.segundos).padStart(2, "0")}</h3>
          <p>SEGUNDOS</p>
        </div>
      </div>

      <div className="grid grid-cols-2b container-800 mt-1">
        <div className="option flex text-shadow shadow flex-col justify-center items-center">
          <i className="fa-solid fa-bomb"></i>
          <p>MEJORES OFERTAS</p>
        </div>
        <div className="option flex text-shadow shadow flex-col justify-center items-center">
          <i className="fa-solid fa-ticket"></i>
          <p>CUPONES</p>
        </div>
        <div className="option flex text-shadow shadow flex-col justify-center items-center">
          <i className="fa-solid fa-credit-card"></i>
          <p>ALIANZAS FINANCIERAS</p>
        </div>
        <div className="option flex text-shadow shadow flex-col justify-center items-center">
          <i className="fa-solid fa-percent"></i>
          <p>HASTA EN 4 CUOTAS</p>
        </div>
      </div>
    </div>
  );
}
