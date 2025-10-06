import React from "react";
import { useFadeUp } from "../customHooks/useFadeUp";

function Footer() {

  useFadeUp();
  return (
    <>
      <footer className="footer fade-up">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ProPulse</h3>
            <p>De la nutrición al entrenamiento, todo en un solo impulso</p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>
              <i className="fas fa-map-marker-alt"></i> Av. Libertador 1250,
              Vitacura
            </p>
            <p>
              <i className="fas fa-phone"></i> +56 2 2234 5678
            </p>
            <p>
              <i className="fas fa-envelope"></i> info@propulse.cl
            </p>
            <p>
              <i className="fas fa-clock"></i> Lun-Vie 24H, Sáb 4:00-22:00
            </p>
          </div>
          <div className="footer-section">
            <h3>Certificaciones</h3>
            <p>• Acreditación ISO 9001:2015</p>
            <p>• Certificación NSCA</p>
            <p>• Miembro ACSM</p>
            <p>• Homologado COI</p>
          </div>
        </div>
        <div className="footer-bottom metal">
          <p>&copy; 2024 ProPulse. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
