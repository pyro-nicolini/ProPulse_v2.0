import Hero from "../../componentes/Hero";
import { useFadeUp } from "../../customHooks/useFadeUp";
import logoColor1 from "../../assets/img/logos/logo_color_w.png";

function Home() {
  useFadeUp();

  return (
    <div className="w-full">
      <div className="glass w-full">
        <section id="hero" className="hero">
          <div className="hero-content fade-up">
              <img src={logoColor1} alt="ProPulse" className="h1-png3 icon-shadow mb-3" />
            <h1 className="text-shadow">De la nutrición al entrenamiento, todo en un solo impulso</h1>
            <p>
              En ProPulse encuentras suplementos, planes de entrenamiento y
              asesoría profesional en un solo lugar. Combinamos nutrición,
              medicina y deporte para que logres tus metas con el mejor impulso.
            </p>
            <a href="#servicios" className="btn btn-danger btn-lg mt-3">
              Descubre Más
            </a>
          </div>
        </section>

        <section id="servicios" className="services">
          <div className="section-header fade-up">
            <h2 className="section-title">Servicios Especializados</h2>
          </div>
          <div className="services-grid">
            <div className="service-card fade-up">
              <div className="service-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Fisiología del Ejercicio</h3>
              <p>
                Pruebas de VO2 máximo, análisis lactato, periodización
                científica y planes de entrenamiento personalizados basados en
                datos.
              </p>
              <a href="#" className="service-link">
                Ver más <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="service-card fade-up">
              <div className="service-icon">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3>Suplementos Deportivos</h3>
              <p>
                Venta de suplementos certificados, asesoría en suplementación
                pre, intra y post entrenamiento según objetivos individuales.
              </p>
              <a href="#" className="service-link">
                Ver más <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="service-card fade-up">
              <div className="service-icon">
                <i className="fas fa-apple-alt"></i>
              </div>
              <h3>Nutrición Deportiva</h3>
              <p>
                Planes nutricionales específicos por disciplina, suplementación
                científica y estrategias de hidratación para competencia.
              </p>
              <a href="#" className="service-link">
                Ver más <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </section>

        <Hero />

        <section id="precios" className="pricing fade-up">
          <div className="section-header">
            <h2 className="section-title">Planes de Membresía</h2>
          </div>
          <div className="container-cards">
            <div className="card text-center">
              <h4>Mensual</h4>
              <h2>$29.990</h2>
              <p>Acceso a máquinas + clases básicas</p>
              <a href="#" className="btn btn-danger">
                Unirme
              </a>
            </div>
            <div className="card text-center">
              <h4>Trimestral</h4>
              <h2>$79.990</h2>
              <p>Incluye asesoría nutricional + descuento en suplementos</p>
              <a href="#" className="btn btn-danger">
                Unirme
              </a>
            </div>
            <div className="card text-center">
              <h4>Anual</h4>
              <h2>$250.000</h2>
              <p>Acceso ilimitado + servicio médico virtual</p>
              <a href="#" className="btn btn-danger">
                Unirme
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
