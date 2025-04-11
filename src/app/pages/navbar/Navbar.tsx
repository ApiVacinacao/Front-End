"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import logo from '../../assets/logo.svg';

const Navbar: React.FC<{ onAboutClick: () => void }> = ({ onAboutClick }) => {
  const [nav, setNav] = useState<boolean>(false);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [navbarBackground, setNavbarBackground] = useState<string>('bg-transparent');
  const [textColor, setTextColor] = useState<string>('text-white');

  const handleClick = (): void => setNav(!nav);
  const handleClose = (): void => setNav(false);

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 50) {
        setShowLogo(true);
        setNavbarBackground('bg-white shadow-lg');
        setTextColor('text-black');
      } else {
        setShowLogo(false);
        setNavbarBackground('bg-transparent');
        setTextColor('text-white');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: "home", label: "Início" },
    { to: "sobre", label: "Sobre Nós", offset: -200, onClick: onAboutClick },
    { to: "transparency", label: "Transparência", offset: -50 },
    { to: "support", label: "Como Ajudar", offset: -50 },
    { to: "eventos", label: "Eventos", offset: -100 },
    { to: "galeria", label: "Galeria", offset: -50 },
  ];

  return (
    <div className={`w-screen h-[80px] fixed z-20 transition-all duration-300 ${navbarBackground}`}>
      <div className="h-full max-w-[1200px] mx-auto px-6 flex items-center">
        <Image 
          src={logo} 
          alt="Logo" 
          width={48} 
          height={48} 
          className={`mr-auto transition-opacity duration-300 cursor-pointer ${showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => {
            const element = document.getElementById("home");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        <ul className={`hidden md:flex flex-grow justify-center space-x-8 ${textColor}`}>
          {navLinks.map(({ to, label, offset, onClick }, index) => (
            <li key={index} className="cursor-pointer">
              <Link 
                to={to} 
                smooth={true} 
                offset={offset || 0} 
                duration={500} 
                className="hover:underline" 
                onClick={onClick} 
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="md:hidden" onClick={handleClick} aria-expanded={nav} aria-label="Toggle navigation">
          {!nav ? <FaBars className={`w-6 ${textColor}`} /> : <FaTimes className={`w-6 ${textColor}`} />} 
        </div>
      </div>

      <ul className={`absolute w-full px-8 bg-white transition-all duration-300 ${!nav ? 'hidden' : 'block'}`}>
        {navLinks.map(({ to, label, offset, onClick }, index) => (
          <li key={index} className="border-b-2 border-zinc-300 w-full cursor-pointer">
            <Link 
              onClick={() => {
                handleClose();
                if (onClick) onClick(); 
              }} 
              to={to} 
              smooth={true} 
              offset={offset || 0} 
              duration={500} 
              className="block py-2 hover:bg-gray-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
