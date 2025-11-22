'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './localAtendimento.module.css';
import ProtectedRoute from '@/app/components/auth/protecetroute';

const API_URL = 'http://127.0.0.1:8000/api/localAtendimentos';

const CadastroLocalAtendimento: React.FC = () => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim() || !endereco.trim() || !telefone.trim()) {
      setMensagem('Por favor, preencha todos os campos!');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setMensagem('Usuário não autenticado. Faça login para continuar.');
      return;
    }

    setLoading(true);
    setMensagem('');

    const telefoneNome = telefone.replace(/\D/g, "")

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, endereco, telefone:telefoneNome }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          const mensagens = Object.values(data.errors)
            .flat()
            .join(' | ');

          setMensagem(mensagens);
        } else {
          setMensagem(data.message || data.error || 'Erro ao cadastrar local');
        }
        return;
      }

      setMensagem('Local de Atendimento cadastrado com sucesso!');
      setNome('');
      setEndereco('');
      setTelefone('');
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ProtectedRoute allowedRoles={"admin"}>
          <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Cadastro de Local de Atendimento</h1>
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

            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Local'}
            </button>

            {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </form>
        </div>
      </main>
    </div>
    </ProtectedRoute>

  );
};

export default CadastroLocalAtendimento;