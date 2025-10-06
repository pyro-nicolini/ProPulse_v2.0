// helpers.js

// Formato de moneda chilena
export const formatoCPL = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});


export const resolveImg = (fileName, tipo = "producto") => {
  if (!fileName) return "";

  // 🔹 Si es una URL absoluta (http o https)
  if (/^https?:\/\//i.test(fileName)) return fileName;

  // 🔹 Si ya apunta a /img/... (desde /public)
  if (fileName.startsWith("/img/")) return fileName;

  // 🔹 Si solo pasas el nombre del archivo, arma la ruta completa
  return `/img/${tipo}/${fileName}`;
};
