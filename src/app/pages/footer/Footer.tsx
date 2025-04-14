import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import styles from '../footer/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={`w-full sticky bottom-0 left-0 z-20 ${styles.footer}`}>
      <div className={`max-w-[1240px] mx-auto border-b-2 border-gray-700 py-8`}>
        <div className="grid grid-cols-2 md:grid-cols-4 text-center">
          <div>
            <h6 className="uppercase text-lg font-bold">Support</h6>
            <ul className="space-y-2">
              <li className="hover:text-[#89b72d] transition-colors cursor-pointer">Galeria</li>
              <li className="hover:text-[#89b72d] transition-colors cursor-pointer">Doações</li>
            </ul>
          </div>
          <div>
            <h6 className="uppercase text-lg font-bold">Sobre Nós</h6>
            <ul className="space-y-2">
              <li className="hover:text-[#89b72d] transition-colors cursor-pointer">Quem Somos</li>
              <li className="hover:text-[#89b72d] transition-colors cursor-pointer">Entre em Contato</li>
            </ul>
          </div>
          <div>
            <h6 className="uppercase text-lg font-bold">Services</h6>
            <ul className="space-y-2">
              <li className="hover:text-[#89b72d] transition-colors cursor-pointer">Consulting</li>
              <li className="hover:text-[#89b72d] transition-colors cursor-pointer">Support</li>
            </ul>
          </div>
          <div>
            <h6 className="uppercase text-lg font-bold">Redes Sociais</h6>
            <div className="flex justify-center space-x-6 text-3xl">
              <a href="#" className="hover:text-[#89b72d] transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-[#89b72d] transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-[1240px] px-4 py-4 mx-auto text-center text-gray-500">
        <p>© 2024 Faculdade Alfa Umuarama, Alunos: Bruno Cherbaty, Rodrigo Alcantara, Maria Guirelli</p>
      </div>
    </footer>
  );
};

export default Footer;
