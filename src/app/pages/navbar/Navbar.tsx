"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import logo from "../../assets/logo.png";

const Navbar: React.FC<{ onAboutClick: () => void }> = ({ onAboutClick }) => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleClick = () => setNav(!nav);
  const handleClose = () => setNav(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div
      className={`w-full h-[80px] fixed top-0 left-0 z-50 transition-all duration-700 ease-in-out ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 flex items-center justify-between transition-all duration-700 ease-in-out">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ease-in-out transform ${
            scrolled
              ? "w-[180px] opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-4"
          } overflow-hidden`}
        >
          <Image
            src={logo}
            alt="Logo"
            width={180}
            height={180}
            className="cursor-pointer"
            onClick={() => {
              document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>

        {/* Menu */}
        <ul
          className={`hidden md:flex flex-1 items-center justify-center space-x-10 text-lg font-medium transition-all duration-700 ease-in-out ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          {navLinks.map(({ to, label, offset, onClick }, index) => (
            <li
              key={index}
              className={`transition-all duration-700 ease-in-out transform opacity-100 translate-y-0`}
            >
              <Link
                to={to}
                smooth={true}
                offset={offset || 0}
                duration={500}
                className="cursor-pointer hover:underline"
                onClick={onClick}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Ícone mobile */}
        <div
          className="md:hidden ml-auto transition-all duration-500 ease-in-out"
          onClick={handleClick}
          aria-expanded={nav}
          aria-label="Toggle navigation"
        >
          {!nav ? (
            <FaBars className={`w-6 h-6 ${scrolled ? "text-black" : "text-white"}`} />
          ) : (
            <FaTimes className={`w-6 h-6 ${scrolled ? "text-black" : "text-white"}`} />
          )}
        </div>
      </div>

      {/* Menu mobile */}
      <ul
        className={`absolute left-0 w-full px-8 bg-white/90 backdrop-blur-lg overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          nav ? "max-h-[500px]" : "max-h-0"
        }`}
      >
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
              className="block py-2 hover:bg-gray-200 text-black"
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
