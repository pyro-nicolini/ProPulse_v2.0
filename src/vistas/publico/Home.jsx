import { Link } from "react-router-dom";
import Hero from "../../componentes/Hero";
import LightningSpinner from "../../componentes/LightningSpinner";
import PromoBanner from "../../componentes/PromoBanner";
import { useFadeUp } from "../../customHooks/useFadeUp";

// ✅ Usa ruta pública (Vite expone /public directamente)
const logoColor1 = `${import.meta.env.BASE_URL}img/logos/logo_propulse3.svg`;

function Home() {
  useFadeUp();

  return (
    <div className="w-full">
      <section className="w-full">
        <PromoBanner />
      </section>
      <section id="hero" className="hero">
        <div className="hero-content fade-up">
          <div className="flex justify-center mb-2">
            <LightningSpinner fondo={false} border={false} />
          </div>
          <h1 className="text-shadow">
            De la nutrición al entrenamiento, todo en un solo impulso
          </h1>
          <p>
            En ProPulse encuentras suplementos, planes de entrenamiento y
            asesoría profesional en un solo lugar. Combinamos nutrición,
            medicina y deporte para que logres tus metas con el mejor impulso.
          </p>
          <Link className="btn btn-primary" to={"/servicios"}>
            Ver Más
          </Link>
        </div>
      </section>

      <section id="servicios" className="services fade-up">
        <div className="section-header">
          <h2 className="section-title">Servicios Especializados</h2>
        </div>
        <div className="services-grid">
          <div className="service-card fade-up">
            <div className="service-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3>Fisiología del Ejercicio</h3>
            <p>
              Pruebas de VO2 máximo, análisis de lactato y planes personalizados
              basados en datos científicos.
            </p>
            <Link className="service-link" to={"/productos"}>
              Ver más <i className="fas fa-arrow-right"></i>
                          </Link>
          </div>

          <div className="service-card fade-up">
            <div className="service-icon">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3>Suplementos Deportivos</h3>
            <p>
              Asesoría en suplementación pre, intra y post entrenamiento según
              tus objetivos.
            </p>
            <Link className="service-link" to={"/productos"}>
              Ver más <i className="fas fa-arrow-right"></i>
                          </Link>
          </div>

          <div className="service-card fade-up">
            <div className="service-icon">
              <i className="fas fa-apple-alt"></i>
            </div>
            <h3>Nutrición Deportiva</h3>
            <p>
              Planes nutricionales específicos, suplementación y estrategias de
              hidratación para competencia.
            </p>

            <Link className="service-link" to={"/productos"}>
              Ver más <i className="fas fa-arrow-right"></i>
                          </Link>
          </div>
        </div>
      </section>

      <Hero />

      <section
        id="precios"
        className="pricing fade-up bg-charcoal-dark visible border-gold"
      >
        <div className="section-header">
          <h2 className="section-title">Planes de Membresía</h2>
        </div>
        <div className="container-cards">
          <div className="card metal text-center">
            <h4>Mensual</h4>
            <h2>$29.990</h2>
            <p>Acceso a máquinas + clases básicas</p>
            <Link className="btn btn-danger" to={"/servicios"}>
              Unirme
            </Link>
          </div>
          <div className="card metal text-center">
            <h4>Trimestral</h4>
            <h2>$79.990</h2>
            <p>Incluye asesoría nutricional + descuento en suplementos</p>
            <Link className="btn btn-danger" to={"/servicios"}>
              Unirme
            </Link>
          </div>
          <div className="card metal text-center">
            <h4>Anual</h4>
            <h2>$250.000</h2>
            <p>Acceso ilimitado + servicio médico virtual</p>
            <Link className="btn btn-danger" to={"/servicios"}>
              Unirme
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
