'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from '../styles/Login.module.css';

const ForgotPasswordSMSPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para formatar o CPF visualmente (com pontuação)
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      Swal.fire({
        icon: 'error',
        title: 'CPF inválido 😕',
        text: 'Por favor, insira um CPF com 11 dígitos válidos.',
        confirmButtonColor: '#d33',
        iconColor: '#d33',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:8000/api/esquecisenha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cpfLimpo }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ CPF existe e senha foi alterada
        Swal.fire({
          icon: 'success',
          title: 'Tudo certo! ✅',
          text: data.message || 'A nova senha foi enviada por SMS para o número cadastrado.',
          confirmButtonColor: '#28a745',
          background: '#f0fff4',
          color: '#155724',
          iconColor: '#28a745',
          showConfirmButton: true,
        });
        setCpf('');
      } else {
        // ❌ CPF não encontrado ou outro erro
        Swal.fire({
          icon: 'error',
          title: 'CPF não encontrado ❌',
          text: data.message || 'Nenhum usuário com este CPF foi localizado.',
          confirmButtonColor: '#d33',
          background: '#fff5f5',
          color: '#721c24',
          iconColor: '#d33',
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de conexão ❌',
        text: 'Não foi possível se conectar ao servidor. Tente novamente.',
        confirmButtonColor: '#d33',
        background: '#fff5f5',
        color: '#721c24',
        iconColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <img src="/aa.png" alt="Logo" className={styles.logo} />

        <h1 className={styles.title}>Recuperar Acesso</h1>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          Informe seu CPF para receber uma nova senha por SMS.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="cpf"
              placeholder=" "
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              maxLength={14}
              disabled={loading}
            />
            <label htmlFor="cpf">CPF cadastrado</label>
          </div>

          <button type="submit" className={styles.btnLogin} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar SMS'}
          </button>
        </form>

        <a href="/" className={styles.forgotLink} style={{ display: 'block', marginTop: '25px' }}>
          Voltar para o login
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordSMSPage;
