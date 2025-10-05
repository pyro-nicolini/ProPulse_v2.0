import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/img/logos/logo_color_w.png";
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
      <div className="navbar card-metal">
        {/* Logo */}
        <Link to="/" className="nav-link" onClick={closeMenu}>
          <img className="navbar-brand" src={logo} alt="ProPulse" />
        </Link>

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
            <Link to="/admin-profile" className="nav-link" onClick={closeMenu}>
              Admin
            </Link>
          )}
          <Link to="/profile-user" className="nav-link" onClick={closeMenu}>
            Perfil
          </Link>
          <Link to="/productos" className="nav-link" onClick={closeMenu}>
            Productos
          </Link>
          <Link to="/servicios" className="nav-link" onClick={closeMenu}>
            Servicios
          </Link>
          <Link to="/contacto" className="nav-link" onClick={closeMenu}>
            Contacto
          </Link>
        </div>

        {/* Área de usuario / carrito */}
        <div className="flex gap-1 items-center justify-center">
          {user ? <ContadorCarrito /> : null}
          {user ? (
            <div className="flex gap-1 items-center justify-center text-center">
              <p className="pt-1 text-silver-light mobile-hidden">
                Hola {user?.nombre}
              </p>
              <button
                onClick={logout}
                className="btn btn-secondary2 mobile-hidden"
              >
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                Ingresar
              </Link>
              <Link to="/register" className="nav-link" onClick={closeMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          {isAdmin && (
            <Link to="/admin-profile" className="nav-link" onClick={closeMenu}>
              Admin
            </Link>
          )}
          <Link to="/profile-user" onClick={closeMenu}>
            Perfil
          </Link>
          <Link to="/productos" onClick={closeMenu}>
            Productos
          </Link>
          <Link to="/servicios" onClick={closeMenu}>
            Servicios
          </Link>
          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>

          {user ? (
            <button onClick={logout} className="btn btn-secondary2">
              Salir
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Ingresar
              </Link>
              <Link to="/register" onClick={closeMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
