export const formatoCPL = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});


export const importImages = () => {
  const images = {};
  const modulesProductos = import.meta.glob(
    "../assets/img/productos/*.{png,jpg,jpeg,svg,webp}",
    { eager: true, import: "default" }
  );
  const modulesServicios = import.meta.glob(
    "../assets/img/servicios/*.{png,jpg,jpeg,svg,webp}",
    { eager: true, import: "default" }
  );
  for (const path in modulesProductos) {
    const imageName = path.split("/").pop();
    images[imageName] = modulesProductos[path];
  }
  for (const path in modulesServicios) {
    const imageName = path.split("/").pop();
    images[imageName] = modulesServicios[path];
  }
  return images;
};