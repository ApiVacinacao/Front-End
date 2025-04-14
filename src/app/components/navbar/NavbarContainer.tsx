import React from 'react';

const NavbarContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <nav className="bg-[#89b72d] p-4 shadow-md">
        <div className="max-w-[1240px] mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Casa da Paz</h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="text-white hover:text-gray-200">Home</a></li>
            <li><a href="/sobre" className="text-white hover:text-gray-200">Sobre</a></li>
            <li><a href="/equipe" className="text-white hover:text-gray-200">Equipe</a></li>
            <li><a href="/contato" className="text-white hover:text-gray-200">Contato</a></li>
          </ul>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default NavbarContainer;
