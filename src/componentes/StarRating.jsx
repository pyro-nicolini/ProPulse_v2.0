import React from "react";

export default function StarRating({
  value = 0,
  max = 5,
  size = 22,
  className = "",
  onChange,
  readOnly = false,
  label = "",
}) {
  const [hover, setHover] = React.useState(null);
  const v = Number(value) || 0;
  const editable = typeof onChange === "function" && !readOnly;

  return (
    <span
      className={
        "star-rating flex items-center gap-0.5 select-none " +
        (editable ? " cursor-pointer " : " ") +
        className
      }
      aria-label={label || "Calificación"}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = hover != null ? i < hover : i < Math.round(v);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={filled ? "#f59e0b" : "#9ca3af"}
            stroke="#f59e0b"
            style={{ display: "inline-block", verticalAlign: "middle" }}
            onMouseEnter={editable ? () => setHover(i + 1) : undefined}
            onMouseLeave={editable ? () => setHover(null) : undefined}
            onClick={editable ? () => onChange(i + 1) : undefined}
            tabIndex={editable ? 0 : -1}
            role={editable ? "button" : undefined}
            aria-pressed={editable ? i < v : undefined}
            aria-label={
              editable ? `${i + 1} estrella${i === 0 ? "" : "s"}` : undefined
            }
          >
            <polygon points="10,2 12.4,7.5 18,7.7 13.5,11.6 15,17 10,13.8 5,17 6.5,11.6 2,7.7 7.6,7.5" />
          </svg>
        );
      })}
    </span>
  );
}
