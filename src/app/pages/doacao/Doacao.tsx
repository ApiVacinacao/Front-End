"use client";

import React, { useEffect, useState } from 'react';
import styles from '../doacao/AllInOneCarousel.module.css';

interface Evento {
  id: number;
  name: string;
  description: string;
  image: string;
}

const Carousel: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const fetchEventos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events/index');
      if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
      }
      const data = await response.json();
      console.log('Dados recebidos:', data); // Verifica os dados retornados
      if (Array.isArray(data)) {
        setEventos(data);
      } else {
        console.error('Os dados retornados não são um array:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % eventos.length);
  };

  const previousEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + eventos.length) % eventos.length);
  };

  return (
    <div id='carrossel' className='w-full relative'>
      <div className="w-full h-[700px] bg-gradient-to-r from-[#f9f9f9] to-[#e3f9e5] absolute"></div>
      <div className='max-w-[1240px] mx-auto py-4 relative z-10'>
        <h3 className={styles.customH3}>Eventos em Destaque</h3>
        <p className={styles.customParagraph}>
          Descubra os momentos mais impactantes dos nossos eventos e como sua participação fez a diferença!
        </p>

        <div className='flex items-center justify-center'>
          <button 
            onClick={previousEvent} 
            className={`${styles.carouselArrow} py-2 px-4 rounded-md text-white bg-[#89b72d] hover:bg-green-600`} 
            style={{ marginRight: '20px' }} 
          >
            &#10094; {/* Ícone de seta para a esquerda */}
          </button>

          <div className={styles.eventoCard}>
            {eventos.length > 0 ? (
              <>
                <img 
                  src={eventos[currentIndex].image}
                  alt={eventos[currentIndex].name}
                  className={styles.eventoImage}
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400'; }} 
                />
                <h4 className='text-xl font-bold text-center'>{eventos[currentIndex].name}</h4>
                <p className={`${styles.eventDescription} text-center`}>{eventos[currentIndex].description}</p>
              </>
            ) : (
              <p className='text-center'>Carregando eventos...</p>
            )}
          </div>

          <button 
            onClick={nextEvent} 
            className={`${styles.carouselArrow} py-2 px-4 rounded-md text-white bg-[#89b72d] hover:bg-green-600`} 
            style={{ marginLeft: '20px' }} 
          >
            &#10095; {/* Ícone de seta para a direita */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
