import { useState } from "react";

export default function LightningSpinner({ fondo = true, border = true }) {
  const [anima, setAnima] = useState(false);

  return (
    <div className={fondo ? "spinner-container fade-in w-full" : ""}>
      <div className={border ? "spinner-border" : ""}>
        <h1
          className={`${border ? "spinner-lightning" : "xl"} ${
            anima ? "animando" : ""
          }`}
          onClick={() => setAnima(!anima)}
        >
          ⚡
        </h1>
      </div>
    </div>
  );
}
