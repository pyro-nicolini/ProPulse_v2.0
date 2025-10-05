import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminForm from "./AdminForm";
import AdminShop from "./AdminShop";
import AdminVentas from "./AdminVentas";
import AdminPublicaciones from "./AdminPublicaciones";
import { useFadeUp } from "../../customHooks/useFadeUp";

export default function AdminProfile() {

  useFadeUp();
  const { user } = useAuth();
  const [tab, setTab] = useState("ventas");

  if (!user) return <p className="m-4">No has iniciado sesión.</p>;
  if (user.rol !== "admin")
    return <p className="m-4">Solo para administradores.</p>;

  return (
    <div className="w-full min-h-screen bg-charcoal border-gold">
    <div className="container-1200 fade-up">
      <h3 className="p-1 text-gradient-primary">Admin Dashboard</h3>
      <div className="p-1">
        <div className="w-full">
            <p className="">
              ID: {user.id} · {user.nombre} ·
            </p>
          </div>
          <div className="flex-col-responsive gap-2">
            <button
              className={`btn ${tab === "ventas" ? "btn-primary" : "btn-secondary2"}`}
              onClick={() => setTab("ventas")}
              >
              🛒 Ventas
            </button>
            <button
              className={`btn ${tab === "shop" ? "btn-primary" : "btn-secondary2"}`}
              onClick={() => setTab("shop")}
              >
              🏬 Shop
            </button>
            <button
              className={`btn ${tab === "crear" ? "btn-primary" : "btn-secondary2"}`}
              onClick={() => setTab("crear")}
              >
              ✏️ Crear
            </button>
            <button
              className={`btn ${tab === "publicaciones" ? "btn-primary" : "btn-secondary2"}`}
              onClick={() => setTab("publicaciones")}
              >
              📢 Publicaciones
            </button>
          </div>

        {tab === "ventas" && <AdminVentas />}
        {tab === "shop" && <AdminShop />}
        {tab === "crear" && <AdminForm onCreated={() => setTab("shop")} />}
        {tab === "publicaciones" && <AdminPublicaciones />}
      </div>
    </div>
              </div>
  );
}
