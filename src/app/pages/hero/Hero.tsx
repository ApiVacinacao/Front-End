"use client";

import React from "react";
import { Link } from "react-scroll";
import bgImg from "../../assets/vacina.png";

const Hero: React.FC = () => {
  return (
    <div
      id="home"
      className="w-full h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImg.src})` }}
    >
      <div className="w-full h-full bg-black/40 flex items-center justify-center">
        <div
          className="text-center text-white px-6 sm:px-8 md:px-12 max-w-3xl"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          {/* Título animado */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight opacity-0 translate-y-4 animate-fade-in-up animation-delay-100"
          >
            Secretária de Saúde Umuarama
          </h1>

          {/* Parágrafo animado */}
          <p
            className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed opacity-0 translate-y-4 animate-fade-in-up animation-delay-300"
          >
            <span className="italic">Vacinar é um ato de amor</span>.
            <br />
            Amor por você, pela sua família e por toda a comunidade.
            Proteja quem você ama. Vacine-se!
          </p>

          {/* Botões com animação em sequência */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="sobre"
              smooth={true}
              offset={-50}
              duration={500}
              className="py-3 px-6 text-lg rounded-lg bg-[#89b72d] text-white hover:bg-[#6f9e24] transition-all duration-300 text-center opacity-0 translate-y-4 animate-fade-in-up animation-delay-500"
            >
              Agende sua vacina!
            </Link>

            <Link
              to="support"
              smooth={true}
              offset={-50}
              duration={500}
              className="py-3 px-6 text-lg border border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-lg font-bold text-center opacity-0 translate-y-4 animate-fade-in-up animation-delay-700"
            >
              Minhas vacinas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
