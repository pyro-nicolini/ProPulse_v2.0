import { Link } from "react-router-dom";
import { useFadeUp } from "../customHooks/useFadeUp";

export default function NotFound() {
  useFadeUp();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-charcoal text-center text-white fade-up visible">
      {/* Fondo y título */}
      <div className="metal card-metal radius shadow-lg p-4 max-w-md mx-auto border border-red-500">
        <h1 className="text-7xl font-extrabold text-gradient-primary mb-2 tracking-widest">
          404
        </h1>

        <h2 className="text-xl text-gradient-secondary font-bold mb-2">
          Página no encontrada
        </h2>

        <p className="text-gray-300 text-small mb-3">
          Parece que seguiste un enlace roto o esta página ya no existe.  
          No te preocupes, puedes volver al inicio y seguir entrenando 💪
        </p>

        <div className="flex justify-center gap-3 mt-3">
          <Link to="/" className="btn btn-primary p-1">
            🏠 Volver al inicio
          </Link>
          <Link to="/productos" className="btn btn-secondary p-1">
            🛒 Ir a la tienda
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 w-full text-center text-gradient-primary opacity-30 text-sm mt-3">
        ProPulse © {new Date().getFullYear()} — React + Vite + PostgreSQL
      </div>
    </div>
  );
}
