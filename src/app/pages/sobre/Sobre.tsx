"use client";

import React, { useEffect, useState } from 'react';
import styles from '../sobre/Sobre.module.css';

interface ImageData {
  id: number;
  name: string;
  position: string; // Cargo da pessoa
  description: string;
  image: string;
}

interface AboutUsData {
  id: number;
  name: string;
  description: string;
}

// Componente de Card da Equipe
const TeamCard: React.FC<{ name: string; position: string; description: string; imageUrl: string; animate: boolean; }> = ({ name, position, description, imageUrl, animate }) => (
  <div className={`team-card relative overflow-hidden rounded-lg shadow-lg bg-white p-6 transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105 ${animate ? 'fadeInUp' : ''}`}>
    <img src={imageUrl} alt={name} className={`${styles.image} rounded-t-lg`} />
    <h4 className={`${styles.customH2} mt-4 font-semibold`}>{position}</h4>
    <h3 className={`${styles.customH3} mt-2 font-bold`}>{name}</h3>
    <p className={`${styles.customParagraph} mt-2 text-gray-700`}>{description}</p>
  </div>
);

// Componente de Card "Sobre Nós"
const AboutUsCard: React.FC<{ name: string; description: string; animate: boolean; }> = ({ name, description, animate }) => (
  <div className={`${styles.aboutUsCard} ${animate ? 'fadeInUp' : ''} p-6 rounded-lg transition-all duration-300`}>
    <h3 className={`${styles.customH3} text-lg font-bold mb-2`}>{name}</h3>
    <p className={`${styles.customParagraph} mt-2 text-gray-600`}>{description}</p>
  </div>
);

const Imagens: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [animateCards, setAnimateCards] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const fetchImagesData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/position_casa/index');
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const result = await response.json();

      // Ordenando conforme a ordem de cargos especificada
      const cargoOrder = [
        'Presidente', 'Vice-Presidente', 'Secretária', 'Tesoureiro', 
        'Conselheiro Fiscal', 'Conselheira Fiscal', 'Suplente'
      ];
      
      // Ordenando os membros conforme a ordem dos cargos, pulando os que não existem
      const sortedImages = result.sort((a: ImageData, b: ImageData) => {
        return cargoOrder.indexOf(a.position) - cargoOrder.indexOf(b.position);
      });

      setImages(sortedImages);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  const fetchAboutUsData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/about_us/index');
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const result = await response.json();
      setAboutUs(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagesData();
    fetchAboutUsData();
  }, []);

  useEffect(() => {
    if (aboutUs.length > 0) {
      setAnimateCards(false);
      setTimeout(() => setAnimateCards(true), 100);
    }
  }, [aboutUs]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container mx-auto px-4 mt-14">
      <section className="about-us-section mb-12">
        <h2 className={styles.teamTitle}>Sobre Nós</h2>
        <div className={styles.aboutUsGrid}>
          {aboutUs.map((item) => (
            <AboutUsCard key={item.id} name={item.name} description={item.description} animate={animateCards} />
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2 className={styles.teamTitle}>Nossa Equipe</h2>
        <div className="image-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.slice(0, showMore ? images.length : 3).map((image) => (
            <TeamCard key={image.id} name={image.name} position={image.position} description={image.description} imageUrl={image.image} animate={animateCards} />
          ))}
        </div>

        {images.length > 3 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowMore(!showMore)}
              className="bg-[#89b72d] text-white font-bold py-2 px-4 rounded"
            >
              {showMore ? 'Mostrar Menos' : 'Mostrar Mais'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Imagens;
