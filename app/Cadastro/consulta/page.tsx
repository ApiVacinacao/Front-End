'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './consulta.module.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/auth/protecetroute';

const API_URL = 'http://localhost:8000/api/tipoConsultas';

const CadastroTipoConsulta: React.FC = () => {
  const [descricao, setDescricao] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Preencha a descrição!',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ descricao, status: true }),
      });

      const data = await res.json();

      // 🔥 Validações do backend
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
          text: data.message || 'Erro inesperado ao cadastrar tipo de consulta.',
        });
        return;
      }

      // 🔥 Sucesso
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tipo de consulta cadastrado com sucesso!',
        timer: 1500,
        showConfirmButton: false,
      });

      setDescricao('');

      setTimeout(() => {
        router.push('/Consulta');
      }, 1500);

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao conectar com o servidor.',
      });
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <h1 className={styles.title}>Cadastrar Tipo de Consulta</h1>

            <div className={styles.row}>
              <div className={styles.col}>
                <input 
                  type="text"
                  className={styles.input}
                  placeholder="Descrição do tipo de consulta"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                />
              </div>
            </div>

            <button className={styles.button} onClick={handleSubmit}>
              Cadastrar
            </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CadastroTipoConsulta;
