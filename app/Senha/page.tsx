'use client';

import React, { useState } from 'react';
import styles from '../styles/Senha.module.css';

const ForgotPasswordPage: React.FC = () => {
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!contact.trim()) {
      setMessage({ text: 'Por favor, informe seu e-mail ou telefone.', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      // Aqui você integraria com sua API para envio de instruções por e-mail/SMS
      // await fetch('/api/send-reset', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ contact }),
      // });

      // Simulação
      setTimeout(() => {
        setLoading(false);
        setSent(true);
        setMessage({
          text: 'As instruções foram enviadas por SMS e e-mail. Verifique sua caixa de entrada.',
          type: 'success',
        });
        setContact('');
      }, 1200);
    } catch {
      setLoading(false);
      setMessage({ text: 'Erro ao enviar. Tente novamente mais tarde.', type: 'error' });
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <img src="/aa.png" alt="Logo" className={styles.logo} />

        <h1 className={styles.title}>Recuperar Acesso</h1>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="contact"
                placeholder=" "
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="contact">E-mail ou telefone cadastrado</label>
            </div>

            <button type="submit" className={styles.btnLogin} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar instruções'}
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
              className="bx bx-check-circle"
              style={{ fontSize: '3rem', color: '#28a745', marginBottom: '10px' }}
            ></i>
            <p style={{ fontSize: '1rem', color: '#2c2c2c', marginBottom: '8px' }}>
              As instruções foram enviadas com sucesso!
            </p>
            <p style={{ fontSize: '0.9rem', color: '#6f6f6f', marginBottom: '20px' }}>
              Verifique o e-mail e o SMS associados à sua conta.
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

export default ForgotPasswordPage;
