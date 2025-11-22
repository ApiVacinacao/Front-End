'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar/page';
import styles from './paciente.module.css';
import ProtectedRoute from '@/app/components/auth/protecetroute';

const CadastroPaciente: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    password_confirmation: '',
    telefone: '', // <-- TELEFONE AQUI
  });

  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Máscaras de CPF e Telefone
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      let v = value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      setFormData(prev => ({ ...prev, cpf: v }));
      return;
    }

    if (name === 'telefone') {
      let t = value.replace(/\D/g, '').slice(0, 11);

      if (t.length <= 10) {
        t = t.replace(/(\d{2})(\d)/, '($1) $2')
             .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        t = t.replace(/(\d{2})(\d)/, '($1) $2')
             .replace(/(\d{5})(\d)/, '$1-$2');
      }

      setFormData(prev => ({ ...prev, telefone: t }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    const { name, email, cpf, password, password_confirmation, telefone } = formData;

    if (!name || !email || !cpf || !password || !password_confirmation || !telefone) {
      setMensagem('Preencha todos os campos obrigatórios!');
      return;
    }

    if (password !== password_confirmation) {
      setMensagem('As senhas não coincidem!');
      return;
    }

    try {
      const payload = {
        name,
        email,
        cpf: cpf.replace(/\D/g, ''),
        telefone: telefone.replace(/\D/g, ''),
        password,
        password_confirmation,
      };

      const token = getToken();

      if (!token) {
        setMensagem('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMensagem('Paciente cadastrado com sucesso!');
        setFormData({
          name: '',
          email: '',
          cpf: '',
          password: '',
          password_confirmation: '',
          telefone: '',
        });
      } else {
        const data = await res.json();

        if (data.errors) {
          const mensagens = Object.values(data.errors)
            .flat()
            .join(' | ');
          setMensagem(mensagens);
        } else {
          setMensagem(data.message || 'Erro ao cadastrar paciente.');
        }
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar paciente.');
    }
  };


  return (
    <ProtectedRoute allowedRoles={"admin"}>
          <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.formContainer}>
          <h1>Cadastro de Paciente</h1>
          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.row}>
              <div className={styles.col}>
                <label htmlFor="name">Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className={styles.col}>
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label htmlFor="cpf">CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className={styles.col}>
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label htmlFor="password">Senha *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crie uma senha segura"
                  required
                />
              </div>

              <div className={styles.col}>
                <label htmlFor="password_confirmation">Confirmação de Senha *</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  required
                />
              </div>
            </div>

            <button type="submit">Cadastrar Paciente</button>
            {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </form>
        </div>
      </main>
    </>
    </ProtectedRoute>

  );
};

export default CadastroPaciente;
