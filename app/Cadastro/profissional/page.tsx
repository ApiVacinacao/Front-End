'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './medico.module.css';

const CadastroMedico: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    crm: '',
    especialidade: '',
    senha: '',
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cpf || !formData.crm || !formData.senha) {
      setMensagem('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    console.log('Dados do médico:', formData);
    setMensagem('Médico cadastrado com sucesso!');
    setFormData({ nome: '', cpf: '', crm: '', especialidade: '', senha: '' });
  };

  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.formContainer}>
          <h1>Cadastro de Médico / Profissional</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.col}>
                <label>Nome*</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className={styles.col}>
                <label>CPF*</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>CRM*</label>
                <input
                  type="text"
                  name="crm"
                  value={formData.crm}
                  onChange={handleChange}
                  placeholder="Digite o CRM"
                  required
                />
              </div>

              <div className={styles.col}>
                <label>Especialidade</label>
                <input
                  type="text"
                  name="especialidade"
                  value={formData.especialidade}
                  onChange={handleChange}
                  placeholder="Ex: Cardiologia"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Senha*</label>
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

            <button type="submit">Cadastrar</button>
            {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </form>
        </div>
      </main>
    </>
  );
};

export default CadastroMedico;
