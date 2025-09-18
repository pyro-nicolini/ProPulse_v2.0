import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import StarRating from "./StarRating";
import { useResenas } from "../contexts/ResenasContext";

function ResenaForm({ resenasUser = [] }) {
  const { id } = useParams();
  const { agregar, actualizar } = useResenas();

  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const bloqueandoAcciones = useRef(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    if (bloqueandoAcciones.current) return;
    bloqueandoAcciones.current = true;

    setBusy(true);
    setMsg("");

    const nuevaResena = {
      comentario: comentario.trim(),
      calificacion: Math.max(1, Math.min(5, Number(calificacion) || 5)),
    };

    try {
      const idResena = resenasUser[0]?.id_resena;

      if (idResena) {
        await actualizar(idResena, id, nuevaResena);
        setMsg("¡Reseña actualizada!");
      } else {
        await agregar(id, nuevaResena);
        setMsg("¡Gracias por tu reseña!");
        setComentario("");
        setCalificacion(5);
      }
    } catch (err) {
      setMsg("");
    } finally {
      setBusy(false);
      bloqueandoAcciones.current = false;
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full p-2 flex flex-col gap-2"
      aria-describedby="resena-msg"
    >
      {msg && (
        <p
          id="resena-msg"
          className="subtitle"
          role="status"
          aria-live="polite"
        >
          {msg}
        </p>
      )}

      <label htmlFor="resena-calificacion" className="text-sm">
        Calificación
      </label>
      <StarRating
        id="resena-calificacion"
        name="calificacion"
        value={calificacion}
        onChange={setCalificacion}
        disabled={busy}
      />

      <label htmlFor="resena-comentario" className="text-sm">
        Comentario
      </label>
      <textarea
        id="resena-comentario"
        name="comentario"
        className="input"
        rows={3}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Comparte tu experiencia…"
        minLength={10}
        disabled={busy}
        aria-required="true"
      />

      <button
        type="submit"
        className="btn-primary"
        disabled={busy || !comentario.trim()}
        aria-busy={busy ? "true" : "false"}
      >
        {busy ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}

export default ResenaForm;
