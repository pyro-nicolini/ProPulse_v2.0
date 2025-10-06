// helpers.js

// Formato de moneda chilena
export const formatoCPL = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});


export const resolveImg = (fileName, tipo = "producto") => {
  if (!fileName) return "";

  if (/^https?:\/\//i.test(fileName)) return fileName;
  if (fileName.startsWith("/img/")) return fileName;

  return `/img/${tipo}s/${fileName}`;
};
