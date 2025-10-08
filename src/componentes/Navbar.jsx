import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
const logo = "../img/logos/logo_propulse_white.png";
import ContadorCarrito from "./ContadorCarrito";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, rehidratar } = useAuth();
  const isAdmin = user?.rol === "admin";

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    rehidratar();
  }, [rehidratar]);

  return (
    <nav className="navbar">
      <div className="navbar metal p-1">
        {/* Logo */}
        <NavLink to="/" className="nav-link" onClick={closeMenu}>
          <img className="navbar-brand" src={logo} alt="ProPulse" />
        </NavLink>

        {/* Botón hamburguesa */}
        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          &#9776;
        </button>

        {/* Links principales */}
        <div className="nav-links flex">
          {isAdmin && (
            <NavLink to="/admin-profile" className="nav-link" onClick={closeMenu}>
              Admin
            </NavLink>
          )}
          <NavLink to="/profile-user" className="nav-link" onClick={closeMenu}>
            Perfil
          </NavLink>
          <NavLink to="/productos" className="nav-link" onClick={closeMenu}>
            Productos
          </NavLink>
          <NavLink to="/servicios" className="nav-link" onClick={closeMenu}>
            Servicios
          </NavLink>
          <NavLink to="/contacto" className="nav-link" onClick={closeMenu}>
            Contacto
          </NavLink>
        </div>

        {/* Área de usuario / carrito */}
        <div className="flex gap-1 items-center justify-center">
          {user ? <ContadorCarrito /> : null}
          {user ? (
            <div className="flex gap-1 items-center justify-center text-center">
              <p className="pt-1 text-silver-light mobile-hidden">
                Hola {user?.nombre}
              </p>
            <button onClick={logout} className="btn btn-secondary2 text-small3">
                Salir
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className="nav-link" onClick={closeMenu}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div id="mobile-menu nav-links" className="mobile-menu">
          {isAdmin && (
            <NavLink to="/admin-profile" className="nav-link" onClick={closeMenu}>
              Admin
            </NavLink>
          )}
          <NavLink to="/profile-user" onClick={closeMenu}>
            Perfil
          </NavLink>
          <NavLink to="/productos" onClick={closeMenu}>
            Productos
          </NavLink>
          <NavLink to="/servicios" onClick={closeMenu}>
            Servicios
          </NavLink>
          <NavLink to="/contacto" onClick={closeMenu}>
            Contacto
          </NavLink>

          {user ? (
            <button onClick={logout} className="btn btn-secondary2 text-small3">
              Salir
            </button>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Ingresar
              </NavLink>
              <NavLink to="/register" onClick={closeMenu}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
