'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './consulta.module.css';

const API_URL = 'http://localhost:8001/api/tipoConsultas';

const CadastroTipoConsulta: React.FC = () => {
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      setMensagem('Preencha a descrição!');
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

      if (!res.ok) throw new Error('Erro ao cadastrar tipo de consulta');

      setMensagem('Tipo de consulta cadastrado com sucesso!');
      setDescricao('');
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar tipo de consulta');
    }
  };

  return (
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

          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        </div>
      </main>
    </div>
  );
};

export default CadastroTipoConsulta;
