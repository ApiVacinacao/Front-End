'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/page';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import styles from './medico.module.css';
import ProtectedRoute from '@/app/components/auth/protecetroute';

interface Especialidade {
  id: number;
  nome: string;
  status: number;
}

const CadastroMedico: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    crm: '',
    especialidade_id: '',
  });

  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/especialidades', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const data = await res.json();

        if (res.ok) {
          setEspecialidades(data.filter((esp: Especialidade) => esp.status === 1));
        } else {
          Swal.fire('Erro', data.message || 'Falha ao carregar especialidades.', 'error');
        }
      } catch (err) {
        Swal.fire('Erro', 'Falha ao carregar especialidades.', 'error');
      }
    };

    fetchEspecialidades();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData(prev => ({ ...prev, cpf: v }));
  };

  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, crm: e.target.value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nome, cpf, crm, especialidade_id } = formData;

    if (!nome || !cpf || !crm || !especialidade_id) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos obrigatórios.',
      });
    }

    try {
      const token = localStorage.getItem('token');

      const payload = {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        CRM: crm.toUpperCase(),
        especialidade_id: Number(especialidade_id),
        status: 1,
      };

      const res = await fetch('http://localhost:8000/api/medicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // 🔥 Tratar ERROS DE VALIDAÇÃO
      if (!res.ok) {
        if (data.errors) {
          const mensagens = Object.values(data.errors)
            .flat()
            .map((msg: any) => `<li>${msg}</li>`)
            .join('');

          return Swal.fire({
            icon: 'error',
            title: 'Erros de validação',
            html: `<ul style="text-align:left;">${mensagens}</ul>`,
          });
        }

        return Swal.fire('Erro', data.message || 'Erro ao cadastrar médico', 'error');
      }

      // 🔥 Sucesso
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Médico cadastrado com sucesso!',
        confirmButtonText: 'Ir para Médicos',
      }).then(() => {
        router.push('/Medicos');
      });

      setFormData({ nome: '', cpf: '', crm: '', especialidade_id: '' });

    } catch (err) {
      Swal.fire('Erro', 'Erro inesperado ao cadastrar médico.', 'error');
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
      <>
        <Navbar />

        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h1>Cadastro de Médico</h1>

            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label>Nome*</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                  />
                </div>

                <div className={styles.col}>
                  <label>CPF*</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
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
                    onChange={handleCrmChange}
                    placeholder="CRM/SP 123456"
                  />
                </div>

                <div className={styles.col}>
                  <label>Especialidade*</label>
                  <select
                    name="especialidade_id"
                    value={formData.especialidade_id}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    {especialidades.map(esp => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit">Cadastrar</button>
            </form>
          </div>
        </main>
      </>
    </ProtectedRoute>
  );
};

export default CadastroMedico;
