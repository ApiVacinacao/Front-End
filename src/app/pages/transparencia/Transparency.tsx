"use client"; // Diretriz para indicar que este é um componente do cliente

import React, { useEffect, useState } from 'react';
import { DocumentIcon, InformationCircleIcon, PhoneIcon, ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import styles from '../transparencia/Transparency.module.css';

interface Card {
  id: number;
  Icon: React.ElementType;
  title: string;
  description: string;
}

interface CardDetails {
  id: number;
  title: string;
  fullDescription: string;
}

const cards: Card[] = [
  {
    id: 1,
    Icon: DocumentIcon,
    title: 'Relatórios Financeiros',
    description: 'Acesse os nossos relatórios financeiros anuais.',
  },
  {
    id: 2,
    Icon: InformationCircleIcon,
    title: 'Prestação de Contas',
    description: 'Saiba como utilizamos as doações para beneficiar a comunidade.',
  },
  {
    id: 3,
    Icon: PhoneIcon,
    title: 'Auditorias',
    description: 'Verifique os resultados das auditorias realizadas.',
  },
];

const Transparency: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = (card: Card) => {
    setSelectedCard(card);
    fetchCardDetails(card.id);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setCardDetails(null);
  };

  const fetchCardDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/valuable'); // Ajuste conforme necessário
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const data = await response.json();
      setCardDetails(data);
    } catch (error) {
      console.error(error);
      setCardDetails({ id, title: 'Erro', fullDescription: 'Erro ao carregar informações' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="transparency" className="w-full mt-14 relative">
      <div className="w-full h-[700px] bg-gradient-to-r from-[#f9f9f9] to-[#e3f9e5] absolute"></div>

      <div className="max-w-[1240px] mx-auto text-gray-900 relative">
        <div className="px-4 py-12 text-center">
          <h3 className={styles.customH3}>Nosso Compromisso com a Clareza</h3>
          <p className={styles.customParagraph}>
            Confira informações detalhadas sobre nossas operações e impacto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-8 px-4 pt-12 sm:pt-20">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl shadow-2xl transition-transform transform hover:scale-105">
              <div className="p-8">
                <card.Icon className="w-16 p-4 bg-[#89b72d] text-white rounded-lg mt-[-4rem] shadow-lg" aria-label={card.title} />
                <h3 className="font-bold text-2xl my-6 text-gray-900">{card.title}</h3>
                <p className="text-gray-600 text-lg">{card.description}</p>
              </div>
              <div className="bg-slate-100 pl-8 py-4">
                <p onClick={() => handleOpenModal(card)} className="flex items-center text-[#89b72d] cursor-pointer">
                  Saiba Mais <ArrowSmallRightIcon className="w-5 ml-2" />
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-96 text-black relative">
              <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500">✕</button>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                cardDetails && (
                  <>
                    <selectedCard.Icon className="w-16 p-4 bg-[#89b72d] text-white rounded-lg mt-[-4rem] mb-4" />
                    <h3 className="text-2xl font-bold mb-4">{cardDetails.title}</h3>
                    <p>{cardDetails.fullDescription}</p>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transparency;
