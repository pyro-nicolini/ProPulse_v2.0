import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 15000,
});

const TOKEN_KEY = "token";

export function setToken(t) {
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
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
export async function getUser() {
  const { data } = await API.get("/auth/me");
  return data;
}
export async function registerUser({ nombre, email, password }) {
  const { data } = await API.post("/auth/register", {
    nombre,
    email,
    password,
  });
  if (data?.token) setToken(data.token);
  return data;
}
export async function loginUser({ email, password }) {
  const { data } = await API.post("/auth/login", { email, password });
  if (data?.token) setToken(data.token);
  return data;
}
export function authLogout() {
  setToken(null);
}

// GESTIONES DE USUARIOS (ADMIN) // FOR NEXT RELEASE
export async function admin_getUsers() {
  const { data } = await API.get(`/usuarios`);
  return data;
}
//sirve para usuario auth o admin modificar otros
export async function updateUser(id, payload) {
  const { data } = await API.put(`/usuarios/${id}`, payload);
  return data;
}
export async function Admin_deleteUser(id) {
  await API.delete(`/usuarios/${id}`);
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

//PRODUCTOS / ADMIN
export async function crearProducto(payload) {
  const { data } = await API.post(`/productos/admin`, payload);
  return data;
}
export async function actualizarProducto(id, payload) {
  const { data } = await API.put(`/productos/admin/${id}`, payload);
  return data;
}
export async function borrarProducto(id) {
  await API.delete(`/productos/admin/${id}`);
  // No se retorna nada porque el backend responde 204 No Content
}

// FAVORITOS
export async function getLikesDelUser() {
  const { data } = await API.get(`/likes`);
  return data;
}
// POST like
export async function addLike(id_producto) {
  const { data } = await API.post(`/likes/${id_producto}`);
  return data;
}
// DELETE like
export async function removeLike(id_producto) {
  const { data } = await API.delete(`/likes/${id_producto}`);
  return data;
}

// RESEÑAS
export async function getAllResenas() {
  const { data } = await API.get(`/resenas`);
  return data;
}
export async function getResenaProduct(id) {
  const { data } = await API.get(`/resenas/${id}`);
  return data;
}
export async function addResena(id, { comentario, calificacion }) {
  const { data } = await API.post(`/resenas/${id}`, {
    comentario,
    calificacion,
  });
  return data;
}
export async function updateResena(id, { comentario, calificacion }) {
  const { data } = await API.put(`/resenas/${id}`, {
    comentario,
    calificacion,
  });
  return data;
}
export async function deleteResena(id) {
  await API.delete(`/resenas/${id}`);
}

// CARRITO
export async function obtenerCarrito(id) {
  const res = await API.get(`/carritos/me`);
  const data = res.data;
  return data;
}
export async function agregarItemCarrito(id_carrito, id_producto) {
  const { data } = await API.put(`/carritos/detalle`, {
    id_carrito,
    id_producto,
  });
  return data;
}
export async function disminuirItemCarrito(id_carrito, id_producto) {
  const { data } = await API.patch(`/carritos/detalle`, {
    id_carrito,
    id_producto,
  });
  return data;
}
export async function eliminarItemDelCarrito(id_carrito, id_producto) {
  const { data } = await API.delete(`/carritos/detalle`, {
    data: {
      id_carrito,
      id_producto,
    },
  });
  return data;
}

// PEDIDOS
export async function pedidosDelUser() {
  const res = await API.get(`/pedidos/me`);
  return res.data;
}
export async function crearPedido(id) {
  const { data } = await API.post(`/pedidos/checkout`);
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
export async function adminUpdatePedido(id_pedido, estado) {
  const { data } = await API.put(`/pedidos/admin`, { id_pedido, estado });
  return data;
}

export async function getPedidosAdmin() {
  const { data } = await API.get("/pedidos/admin");
  return data;
}

// Utils
export const isAuth = () => !!getToken(); // t o f

export async function asegurandoLaAuth() {
  // Funcion que detiene procesos si no hay Sesion auth valida
  if (!isAuth()) throw { status: 401, error: "No autenticado" };
  const me = await getUser().catch(() => null);
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
