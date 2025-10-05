import { useState } from "react";
import logoColor1 from "../../assets/img/logos/logo_color_bg2.svg";
import { useFadeUp } from "../../customHooks/useFadeUp";

export default function Contacto() {

  useFadeUp();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.nombre]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setMsg("");

    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      setMsg("Completa nombre, email y mensaje.");
      return;
    }

    setBusy(true);
    try {
      setMsg("¡Gracias! Te contactaremos pronto.");
      setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
    } catch {
      setMsg("No se pudo enviar. Intenta más tarde.");
    } finally {
      setBusy(false);
    }
  };

  const datos = {
    nombre: "ProPulse",
    correo: "contacto@propulse.cl",
    telefono: "+56 9 1234 5678",
    direccion: "Av. Falsa 123, Santiago, Chile",
    horario: "Lun a Vie: 09:00–18:00",
    instagram: "@propulse_cl",
  };

  const mapaSrc =
    "https://maps.google.com/maps?q=Plaza%20de%20Armas%20Santiago&t=&z=14&ie=UTF8&iwloc=B&output=embed";

  return (
    <>
      <div className="w-full grid p-2 gap-1 grid-cols-2 fondo1">
        <div className="flex flex-col gap-4 w-full fade-up">
          <div className="w-full p-4 m-1 flex flex-col">
            <h2 className="card-title text-gradient-primary"><strong>Contacto</strong></h2>
                <img src={logoColor1} alt="ProPulse" className="img" />
            <p className="subtitle">
              ¿Tienes dudas o necesitas ayuda? Escríbenos.
            </p>
            <ul className="mt-2 leading-relaxed w-full">
              <li>
                <strong>Empresa:</strong> {datos.nombre}
              </li>
              <li>
                <strong>Correo:</strong> {datos.correo}
              </li>
              <li>
                <strong>Teléfono:</strong> {datos.telefono}
              </li>
              <li>
                <strong>Dirección:</strong> {datos.direccion}
              </li>
              <li>
                <strong>Horario:</strong> {datos.horario}
              </li>
              <li>
                <strong>Instagram:</strong>{" "}
                <a
                  className="link"
                  href="https://instagram.com/propulse_cl"
                  target="_blank"
                  rel="noreferrer"
                >
                  {datos.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card-white p-4 m-1 fade-up">
          <h2 className="card-title"> Escríbenos y
            <br />
            <strong className="text-gradient-primary">
              SUBE DE NIVEL +1 
              </strong>
              💪
            </h2>
          {msg ? <p className="subtitle mt-1">{msg}</p> : null}

          <form
            onSubmit={onSubmit}
            className="mt-3 flex flex-col gap-3 w-full h-min"
          >
            <div className="grid gap-3 grid-cols-1 w-full">
              <label className="flex flex-col">
                <span className="text-sm">Nombre</span>
                <input
                  className="input"
                  name="nombre"
                  value={form.nombre}
                  onChange={onChange}
                  placeholder="Tu nombre"
                  disabled={busy}
                  autoComplete="nombre"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm">Email</span>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="correo@ejemplo.com"
                  disabled={busy}
                  autoComplete="email"
                />
              </label>
            </div>

            <div className="grid gap-3 grid-cols-1 w-full">
              <label className="flex flex-col">
                <span className="text-sm">Teléfono (opcional)</span>
                <input
                  className="input"
                  name="telefono"
                  value={form.telefono}
                  onChange={onChange}
                  placeholder="+56 9 ... ..."
                  disabled={busy}
                  autoComplete="tel"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm">Asunto</span>
                <input
                  className="input"
                  name="asunto"
                  value={form.asunto}
                  onChange={onChange}
                  placeholder="Consulta, soporte, cotización…"
                  disabled={busy}
                />
              </label>
            </div>
            <div className="grid gap-3 grid-cols-1 w-full">
              <label className="flex flex-col">
                <span className="text-sm">Mensaje</span>
                <textarea
                  className="input"
                  name="mensaje"
                  rows={5}
                  value={form.mensaje}
                  onChange={onChange}
                  placeholder="Cuéntanos brevemente cómo podemos ayudarte."
                  disabled={busy}
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={
                  busy ||
                  !form.nombre.trim() ||
                  !form.email.trim() ||
                  !form.mensaje.trim()
                }
              >
                {busy ? "Enviando…" : "Enviar"}
              </button>
              <a
                className="btn btn-secondary p-05"
                href={`mailto:${"contacto@propulse.cl"}?subject=${encodeURIComponent(
                  form.asunto || "Consulta ProPulse"
                )}`}
              >
                Enviar por correo
              </a>
            </div>
          </form>
        </div>
      </div>
      {/* Mapa */}
      <div className="w-full aspect-video overflow-hidden rounded h-mid fade-up">
        <iframe
          title="Mapa ProPulse"
          src={mapaSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
}
