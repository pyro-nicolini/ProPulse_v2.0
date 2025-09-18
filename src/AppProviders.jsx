import AuthProvider from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import ShopProvider from "./contexts/ShopContext";
import ResenasProvider from "./contexts/ResenasContext";
import FavoritosProvider from "./contexts/FavoritosContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ShopProvider>
          <FavoritosProvider>
            <ResenasProvider>
              {children}
            </ResenasProvider>
          </FavoritosProvider>
        </ShopProvider>
      </CartProvider>
    </AuthProvider>
  );
}
