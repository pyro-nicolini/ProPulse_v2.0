import React from "react";

export default function LightningSpinner({ fondo = true }) {
  return (
    <>
      {fondo ? (
        <div className="spinner-container fade-in w-full">
          <div className="spinner-border">
            <div className="spinner-lightning">⚡</div>
          </div>
        </div>
      ) : (
        <div className="spinner-border">
          <div className="spinner-lightning">⚡</div>
        </div>
      )}
    </>
  );
}
