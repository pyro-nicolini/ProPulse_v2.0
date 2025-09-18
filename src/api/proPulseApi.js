import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 15000,
});

const TOKEN_KEY = "token";
export function setToken(t) {
  t
    ? sessionStorage.setItem(TOKEN_KEY, t)
    : sessionStorage.removeItem(TOKEN_KEY);
}
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || null;
}

API.interceptors.request.use((config) => {
  const tk = getToken();
  if (tk) config.headers.Authorization = `Bearer ${tk}`;
  return config;
});
API.interceptors.response.use(
  (res) => res,
  (err) =>
    Promise.reject({
      status: err?.response?.status || 0,
      ...(err?.response?.data || { error: "Error de red" }),
    })
);

// AUTH
export async function authRegister({ nombre, email, password }) {
  const { data } = await API.post("/auth/register", {
    nombre,
    email,
    password,
  });
  if (data?.token) setToken(data.token);
  return data;
}
export async function authLogin({ email, password }) {
  const { data } = await API.post("/auth/login", { email, password });
  if (data?.token) setToken(data.token);
  return data;
}
export async function authMe() {
  const { data } = await API.get("/auth/me");
  return data;
}
export function authLogout() {
  setToken(null);
}

// USUARIOS
export async function updateUsuario(id, payload) {
  const { data } = await API.put(`/usuarios/${id}`, payload);
  return data;
}
export async function deleteUsuario(id) {
  await API.delete(`/usuarios/${id}`);
  return true;
}

// PRODUCTOS
export async function getProductos(params = {}) {
  const { data } = await API.get("/productos", { params });
  return data;
}
export async function getProducto(id) {
  const { data } = await API.get(`/productos/${id}`);
  return data;
}
export async function crearProducto(payload) {
  const { data } = await API.post(`/productos/admin`, payload);
  return data;
}
export async function actualizarProducto(id, payload) {
  const { data } = await API.put(`/productos/admin/${id}`, payload);
  return data;
}
export async function borrarProducto(id) {
  const { data } = await API.delete(`/productos/admin/${id}`);
  return data;
}
export async function setProductoDestacado(id, destacado = true) {
  const { data } = await API.put(`/productos/admin/${id}/destacado`, {
    destacado,
  });
  return data;
}

// CARRITOS
export async function getMiCarrito() {
  const { data } = await API.get(`/carritos/me`);
  return data;
}
export async function agregarItemCarrito({ id_producto, cantidad = 1 }) {
  const { data } = await API.post(`/carritos/detalle`, {
    id_producto,
    cantidad,
  });
  return data;
}
export async function updateItemCarrito(id_item, { cantidad }) {
  const { data } = await API.put(`/carritos/detalle/${id_item}`, { cantidad });
  return data;
}
export async function borrarItemCarrito(id_item) {
  await API.delete(`/carritos/detalle/${id_item}`);
  return true;
}
export function calcularTotales(items = []) {
  const subtotal = items.reduce(
    (acc, it) => acc + Number(it.subtotal || it.precio_fijo * it.cantidad || 0),
    0
  );
  const iva = Math.round(subtotal * 0.19);
  const envio = 0;
  const total = subtotal + iva + envio;
  return { subtotal, iva, envio, total };
}

// PEDIDOS
export async function crearPedido() {
  const { data } = await API.post(`/pedidos`, {});
  return data;
}
export async function getMisPedidos() {
  const { data } = await API.get(`/pedidos`);
  return data;
}
export async function getPedido(id) {
  const { data } = await API.get(`/pedidos/${id}`);
  return data;
}
export async function adminUpdatePedido(id_pedido, body) {
  const { data } = await API.put(`/pedidos/admin/${id_pedido}`, body);
  return data;
}
export async function getPedidosAdmin() {
  const { data } = await API.get("/pedidos/admin");
  return data;
}

// FAVORITOS
export async function getFavoritos() {
  const { data } = await API.get(`/favoritos`);
  return data;
}
export async function addFavorito(id_producto) {
  const { data } = await API.post(`/favoritos`, { id_producto });
  return data;
}
export async function removeFavorito(id_favorito) {
  await API.delete(`/favoritos/${id_favorito}`);
  return true;
}

// RESEÑAS
export async function getResenas() {
  const { data } = await API.get(`/resenas`);
  return data;
}
export async function getResenasByProducto(id_producto) {
  const { data } = await API.get(`/resenas/producto/${id_producto}`);
  return data;
}
export async function crearResena(id_producto, { comentario, calificacion }) {
  const { data } = await API.post(`/resenas/producto/${id_producto}`, {
    comentario,
    calificacion,
  });
  return data;
}
export async function actualizarResena(
  id_resena,
  { comentario, calificacion }
) {
  const { data } = await API.put(`/resenas/${id_resena}`, {
    comentario,
    calificacion,
  });
  return data;
}
export async function borrarResena(id_resena) {
  await API.delete(`/resenas/${id_resena}`);
  return true;
}

// Utils
export const isAuth = () => !!getToken(); // t o f

export async function asegurandoLaAuth() {
  // Funcion que detiene procesos si no hay Sesion auth valida
  if (!isAuth()) throw { status: 401, error: "No autenticado" };
  const me = await authMe().catch(() => null);
  if (!me) throw { status: 401, error: "Token inválido" };
  return me;
}

/* Ese helper asegurandoLaAuth es básicamente un guardia de autenticación: 
valida que tengas token válido y que el backend confirme que corresponde a un usuario real.
Dónde usarlo depende de qué quieras proteger:

🔒 En el frontend
Antes de acciones críticas que requieran usuario logueado:
Crear pedido (checkout).
Dejar reseña.
Agregar favorito.

Editar perfil de usuario.*/
