'use client';

import React, { useState, useEffect } from 'react';
import styles from '../galeria/Galeria.module.css';

interface Evento {
  id: number;
  name: string;
  image: string;
  description: string;
}

const Galeria: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 6;

  const fetchEventos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/image/index'); 
      if (!response.ok) {
        throw new Error('Erro ao buscar imagens');
      }
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const eventosToShow = eventos.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < eventos.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div id='galeria' className='w-full text-white relative'>
      <div className="w-full h-[700px] bg-gradient-to-r from-[#f9f9f9] to-[#e3f9e5] absolute"></div>
      <div className='max-w-[1240px] mx-auto py-4 relative z-10'> {/* Aumentado para 4 para um leve espaço */}
        <h3 className={styles.customH3}>Galeria de Eventos e Doações</h3>
        <p className={styles.customParagraph}>
          Reviva os momentos marcantes dos nossos eventos anteriores e veja como sua generosidade fez a diferença!
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {eventosToShow.map(evento => (
            <div key={evento.id} className='bg-white text-slate-900 p-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl'>
              <img 
                src={evento.image} 
                alt={evento.name} 
                className='rounded-lg mb-2'
                style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover' }}
              />
              <h4 className='text-lg font-bold text-center'>{evento.name}</h4>
              <p className='text-sm text-center text-gray-700'>{evento.description}</p>
            </div>
          ))}
        </div>

        <div className='flex justify-center space-x-4 mt-8'>
          <button 
            onClick={handlePreviousPage} 
            className='py-2 px-4 rounded-md text-white bg-[#89b72d] hover:bg-green-600'
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <button 
            onClick={handleNextPage} 
            className='py-2 px-4 rounded-md text-white bg-[#89b72d] hover:bg-green-600'
            disabled={(currentPage + 1) * itemsPerPage >= eventos.length}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Galeria;
