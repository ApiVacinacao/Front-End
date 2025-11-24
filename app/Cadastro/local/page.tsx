'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './localAtendimento.module.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/auth/protecetroute';

const API_URL = 'http://127.0.0.1:8001/api/localAtendimentos';

const CadastroLocalAtendimento: React.FC = () => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!nome.trim() || !endereco.trim() || !telefone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos antes de continuar.',
      });
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado',
        text: 'Você precisa estar logado para cadastrar locais.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, endereco, telefone, status: true }),
      });

      const data = await res.json();

      // 🔥 ERROS DE VALIDAÇÃO DA API
      if (!res.ok) {
        if (data.errors) {
          const mensagens = Object.values(data.errors)
            .flat()
            .map((msg: any) => `<li>${msg}</li>`)
            .join('');

          Swal.fire({
            icon: 'error',
            title: 'Erros de validação',
            html: `<ul style="text-align:left;">${mensagens}</ul>`,
          });

          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar',
          text: data.error || data.message || 'Não foi possível salvar o local.',
        });
        return;
      }

      // 🔥 SUCESSO
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Local de atendimento cadastrado com sucesso!',
        confirmButtonText: 'Ir para Locais',
      }).then(() => {
        router.push('/Locais');
      });

      setNome('');
      setEndereco('');
      setTelefone('');

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erro de conexão',
        text: 'Não foi possível conectar ao servidor.',
      });
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
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CadastroLocalAtendimento;
