import { Link } from "react-router-dom";
import { useFadeUp } from "../../customHooks/useFadeUp";

export default function NotFound() {
  useFadeUp();

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center text-center text-white fade-up visible  p-2"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, rgba(255,0,0,0.15), transparent 70%), linear-gradient(180deg, #0b0b0b 0%, #1a1a1a 100%)",
      }}
    >
      <div className="metal card-metal radius shadow-lg p-4 max-w-md mx-auto border border-red-500">
        <h1 className="text-7xl font-extrabold text-gradient-primary mb-2 tracking-widest drop-shadow-lg">
          404
        </h1>

        <h2 className="text-xl text-gradient-secondary font-bold mb-2">
          Página no encontrada
        </h2>

        <p className="text-gray-300 text-small mb-3 leading-relaxed">
          Parece que seguiste un enlace roto o esta página ya no existe.  
          No te preocupes, puedes volver al inicio y seguir entrenando 💪
        </p>

        <div className="flex justify-center gap-3 mt-3">
          <Link to="/" className="btn btn-primary p-1">
            Volver al inicio
          </Link>
          <Link to="/productos" className="btn btn-secondary p-1">
            🛒 Ir a la tienda
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 w-full text-center text-gradient-primary opacity-40 text-sm mt-3">
        ProPulse © {new Date().getFullYear()} — PyroDev - GiordanDev - JoseDev
      </div>
    </div>
  );
}
