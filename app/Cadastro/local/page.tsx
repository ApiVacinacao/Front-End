'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './localAtendimento.module.css';

const CadastroLocalAtendimento: React.FC = () => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = () => {
    if (!nome.trim() || !endereco.trim() || !telefone.trim()) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    setMensagem('Local de Atendimento cadastrado com sucesso!');
    setNome('');
    setEndereco('');
    setTelefone('');
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1>Cadastro de Local de Atendimento</h1>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label htmlFor="nome">Nome do Local *</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite o nome do local"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label htmlFor="endereco">Endereço *</label>
            <input
              id="endereco"
              type="text"
              placeholder="Digite o endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <label htmlFor="telefone">Telefone *</label>
            <input
              id="telefone"
              type="tel"
              placeholder="Digite o telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <button type="submit">Cadastrar Local</button>
            {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroLocalAtendimento;
