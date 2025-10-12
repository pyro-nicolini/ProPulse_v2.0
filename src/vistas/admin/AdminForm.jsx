import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useShop } from "../../contexts/ShopContext";
import { useFadeUp } from "../../customHooks/useFadeUp";

const init = {
  titulo: "",
  descripcion: "",
  tipo: "producto",
  stock: 0,
  url_imagen: "",
  precio: 0,
};

export default function AdminForm() {
  const { user } = useAuth();
  const { createProduct, refreshProductos, loading } = useShop();
  const [f, setF] = useState(init);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useFadeUp();

  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const reset = () => setF(init);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user?.rol !== "admin") return;

    setBusy(true);
    setMsg("");

    try {
      const payload = {
        ...f,
        stock: f.tipo === "producto" ? Number(f.stock) : null,
        precio: Number(f.precio),
      };

      const nuevo = await createProduct(payload);

      await refreshProductos();

      reset();
      setMsg(
        nuevo?.id_producto
          ? `✅ Creado #${nuevo.id_producto}`
          : "✅ Producto creado correctamente"
      );
    } catch (err) {
      console.error("Error creando producto:", err);
      setMsg(err?.error || "❌ No se pudo crear el producto");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 2500);
    }
  };

  if (user?.rol !== "admin") return <p>No autorizado.</p>;

  return (
    <div>
      <h2 className="text-gradient-primary mt-2">Crear producto</h2>
    <div className="bg-gradient-primary p-05 radius text-shadow shadow fade-up visible">
    <div className="glass p-1">

      <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
        <label className="w-full">
          Título
          <input
            className="input w-full"
            value={f.titulo}
            onChange={(e) => onChange("titulo", e.target.value)}
            required
            />
        </label>

        <label className="w-full">
          Descripción
          <textarea
            className="input w-full"
            rows={3}
            value={f.descripcion}
            onChange={(e) => onChange("descripcion", e.target.value)}
            required
            />
        </label>

          <label className="w-full">
            Tipo
            <select
              className="input w-full"
              value={f.tipo}
              onChange={(e) => onChange("tipo", e.target.value)}
              >
              <option value="producto">producto</option>
              <option value="servicio">servicio</option>
            </select>
          </label>

          <label className="w-full">
            Stock
            <input
              type="number"
              className="input w-full"
              value={f.tipo === "producto" ? f.stock : ""}
              onChange={(e) => onChange("stock", e.target.value)}
              disabled={f.tipo !== "producto"}
              />
          </label>

          <label className="w-full">
            Precio
            <input
              type="number"
              className="input w-full"
              value={f.precio}
              onChange={(e) => onChange("precio", e.target.value)}
              required
            />
          </label>

        <label className="w-full">
          Imagen
          <input
            className="input w-full"
            placeholder="producto1_1.webp o https://..."
            value={f.url_imagen}
            onChange={(e) => onChange("url_imagen", e.target.value)}
            />
        </label>

        <div className="flex gap-2">
          <button className="btn btn-primary shadow" type="submit" disabled={busy || loading}>
            {busy ? "Creando..." : "Crear"}
          </button>
          <button className="btn btn-secondary shadow" type="button" onClick={reset} disabled={busy}>
            Limpiar
          </button>
        </div>

        {msg && <p className="text-sm opacity-80 mt-2">{msg}</p>}
      </form>
    </div>
    </div>
            </div>
  );
}
