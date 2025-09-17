'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar/page';
import styles from './paciente.module.css';

const CadastroPaciente: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    cns: '',
    senha: '',
  });
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  // Atualiza campos com máscaras para CPF e CNS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      let v = value.replace(/\D/g, '').slice(0, 11); // só números, max 11
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setFormData(prev => ({ ...prev, cpf: v }));
    } else if (name === 'cns') {
      let v = value.replace(/\D/g, '').slice(0, 15); // só números, max 16
      v = v.replace(/^(\d{3})(\d)/, '$1 $2')
           .replace(/^(\d{3} \d{4})(\d)/, '$1 $2')
           .replace(/^(\d{3} \d{4} \d{4})(\d)/, '$1 $2');
      setFormData(prev => ({ ...prev, cns: v }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    const { nome, email, cpf, cns, senha } = formData;

    if (!nome || !email || !cpf || !cns || !senha) {
      setMensagem('Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      // Remove formatação antes de enviar
      const payload = {
        nome,
        email,
        cpf: cpf.replace(/\D/g, ''),  // apenas números
        cns: cns.replace(/\D/g, ''),  // apenas números
        senha,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMensagem('Paciente cadastrado com sucesso!');
        setFormData({ nome: '', email: '', cpf: '', cns: '', senha: '' });
        setTimeout(() => router.push('/'), 1500);
      } else {
        const data = await res.json();
        setMensagem(data.message || 'Erro ao cadastrar paciente.');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar paciente.');
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.formContainer}>
          <h1>Cadastro de Paciente</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.col}>
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
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
                <label htmlFor="cns">CNS *</label>
                <input
                  type="text"
                  name="cns"
                  value={formData.cns}
                  onChange={handleChange}
                  placeholder="000 0000 0000 0000"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label htmlFor="senha">Senha *</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Crie uma senha segura"
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
  );
};

export default CadastroPaciente;
