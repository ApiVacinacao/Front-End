'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar/page';
import styles from './paciente.module.css';
import Swal from 'sweetalert2';
import ProtectedRoute from '@/app/components/auth/protecetroute';

const CadastroPaciente: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    password_confirmation: '',
    telefone: '',
  });

  const router = useRouter();

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

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

    const { name, email, cpf, password, password_confirmation, telefone } = formData;

    if (!name || !email || !cpf || !password || !password_confirmation || !telefone) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos.',
      });
    }

    if (password !== password_confirmation) {
      return Swal.fire({
        icon: 'warning',
        title: 'Senhas diferentes',
        text: 'As senhas não coincidem.',
      });
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
        return Swal.fire({
          icon: 'error',
          title: 'Erro de autenticação',
          text: 'Faça login novamente.',
        });
      }

      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar',
          text: data.message || 'Algo deu errado.',
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Paciente cadastrado com sucesso!',
        confirmButtonText: 'Ir para pacientes',
      }).then(() => {
        router.push('/Pacientes');
      });

      setFormData({ name: '', email: '', cpf: '', password: '', password_confirmation: '', telefone: '' });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erro no servidor',
        text: 'Não foi possível cadastrar o paciente.',
      });
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
                <label>Nome *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                />
              </div>

              <div className={styles.col}>
                <label>E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className={styles.col}>
                <label>Telefone *</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Senha *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha"
                />
              </div>

              <div className={styles.col}>
                <label>Confirmação *</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirme a senha"
                />
              </div>
            </div>

            <button type="submit">Cadastrar Paciente</button>
          </form>
        </div>
      </main>
    </>
    </ProtectedRoute>
  );
};

export default CadastroPaciente;