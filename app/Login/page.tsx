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
    const digits = e.target.value.replace(/\D/g, '');
    setCpf(digits.slice(0, 11));
  };

  const handleLogin = async () => {
    if (!cpf || !password) {
      alert('Preencha todos os campos!');
      return;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, password }),
    });

    if (res.ok) {
      if (remember) localStorage.setItem('rememberMe', 'true');
      router.replace('/');
    } else {
      alert('CPF ou senha inválidos!');
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
            value={formatCpf(cpf)}
            onChange={handleCpfChange}
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
          <a href="/senha" className={styles.forgotLink}>Esqueci minha senha</a>
        </div>

        <button className={styles.btnLogin} onClick={handleLogin}>
          Acessar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
