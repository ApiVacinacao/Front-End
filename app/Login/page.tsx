'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';

const LoginPage: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted += digits.slice(0, 3);
    if (digits.length >= 4) formatted += '.' + digits.slice(3, 6);
    if (digits.length >= 7) formatted += '.' + digits.slice(6, 9);
    if (digits.length >= 10) formatted += '-' + digits.slice(9, 11);
    return formatted;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value)); // 👈 agora guarda formatado
  };

  const handleLogin = async () => {
    const digits = cpf.replace(/\D/g, ''); // 👈 envia só números

    if (!digits || !password) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: digits, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('user_id', String(data.user.id));
        if (remember) localStorage.setItem('rememberMe', 'true');
        router.replace('/'); 
      } else {
        alert(data.error || 'CPF ou senha inválidos!');
      }
    } catch (error) {
      alert('Erro na conexão com o servidor.');
      console.error(error);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <img src="/aa.png" alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Acesse sua conta</h1>

        <div className={styles.inputGroup}>
          <input
            type="text"
            id="cpf"
            placeholder=" "
            value={cpf}
            onChange={handleCpfChange}
            maxLength={14} // 👈 limita ao formato 000.000.000-00
          />
          <label htmlFor="cpf">CPF</label>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            id="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Senha</label>
        </div>

        <div className={styles.rememberForgot}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Lembrar-me</label>
          </div>
          <a href="/Senha" className={styles.forgotLink}>
            Esqueci minha senha
          </a>
        </div>

        <button className={styles.btnLogin} onClick={handleLogin}>
          Acessar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;