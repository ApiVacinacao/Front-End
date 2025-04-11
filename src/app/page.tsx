"use client"; // Adicione esta linha para tornar o componente um cliente

import Navbar from "./pages/navbar/Navbar";
import Hero from "./pages/hero/Hero";
import Sobre from "./pages/sobre/Sobre";
import Transparencia from "./pages/transparencia/Transparency";
import Support from "./pages/support/Support";
import Carousel from "./pages/doacao/Doacao";
import Galeria from "./pages/galeria/Galeria";
import Footer from "./pages/footer/Footer";

const Home: React.FC = () => {
  const handleAboutClick = () => {
    // Lógica para rolar suavemente até a seção "Sobre"
    const element = document.getElementById("sobre");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAboutClick={handleAboutClick} />
      <main className="flex flex-col flex-1">
        <Hero />
        <div className="bg-gray-50" id="sobre"> {/* ID para a seção "Sobre" */}
          <Sobre />
        </div>
        <div className="bg-gray-50">
          <Transparencia />
        </div>
        <div className="bg-gray-50">
          <Support />
        </div>
        <div className="bg-gray-50" id="eventos"> {/* ID deve ser "eventos" */}
          <Carousel />
        </div>
        <div className="bg-gray-50">
          <Galeria />
        </div>
      </main>
      <div className="bg-gray-50">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
