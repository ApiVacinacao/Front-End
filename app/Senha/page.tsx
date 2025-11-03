'use client';

import React, { useState } from 'react';
import styles from '../styles/Login.module.css'; // mesmo estilo do login

const ForgotPasswordSMSPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/; // formato BR básico

    if (!phone.trim()) {
      setMessage({ text: 'Por favor, informe seu número de telefone.', type: 'error' });
      return;
    }

    if (!phoneRegex.test(phone)) {
      setMessage({ text: 'Número de telefone inválido.', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      // Aqui você integraria com sua API para envio de SMS
      // await fetch('/api/auth/send-sms-reset', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone }),
      // });

      // Simulação de envio
      setTimeout(() => {
        setLoading(false);
        setSent(true);
        setMessage({
          text: 'Um SMS com as instruções para redefinição foi enviado para seu número.',
          type: 'success',
        });
        setPhone('');
      }, 1200);
    } catch {
      setLoading(false);
      setMessage({ text: 'Erro ao enviar o SMS. Tente novamente mais tarde.', type: 'error' });
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <img src="/aa.png" alt="Logo" className={styles.logo} />

        <h1 className={styles.title}>Recuperar Acesso via SMS</h1>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="phone"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="phone">Telefone cadastrado</label>
            </div>

            <button type="submit" className={styles.btnLogin} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar SMS'}
            </button>

            {message.text && (
              <p
                style={{
                  color: message.type === 'error' ? '#dc3545' : '#28a745',
                  marginTop: '15px',
                  fontSize: '0.9rem',
                }}
              >
                {message.text}
              </p>
            )}
          </form>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease', textAlign: 'center' }}>
            <i
              className="bx bx-message-check"
              style={{ fontSize: '3rem', color: '#28a745', marginBottom: '10px' }}
            ></i>
            <p style={{ fontSize: '1rem', color: '#2c2c2c', marginBottom: '8px' }}>
              SMS enviado com sucesso!
            </p>
            <p style={{ fontSize: '0.9rem', color: '#6f6f6f', marginBottom: '20px' }}>
              Verifique sua caixa de mensagens e siga as instruções recebidas.
            </p>
            <button
              className={styles.btnLogin}
              onClick={() => {
                setSent(false);
                setMessage({ text: '', type: '' });
              }}
            >
              Enviar novamente
            </button>
          </div>
        )}

        <a href="/" className={styles.forgotLink} style={{ display: 'block', marginTop: '25px' }}>
          Voltar para o login
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordSMSPage;
