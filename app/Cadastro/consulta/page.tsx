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
    // setMensagem('');

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

      if (!res.ok) throw new Error();

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tipo de consulta cadastrado com sucesso!',
        timer: 1500,
        showConfirmButton: false,
      });

      setDescricao('');

      // Redireciona rápido
      setTimeout(() => {
        router.push('/Consulta');
      }, 1500);

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao cadastrar tipo de consulta',
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
// function setMensagem(arg0: string) {
//   throw new Error('Function not implemented.');
// }