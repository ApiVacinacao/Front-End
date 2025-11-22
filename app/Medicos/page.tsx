'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css';
import ProtectedRoute from '../components/auth/protecetroute';

type Especialidade = {
  id: number;
  nome: string;
};

type Medico = {
  id: number;
  nome: string;
  cpf: string;
  CRM: string;
  status: boolean;
  especialidade_id: number;
  especialidade?: Especialidade | null;
};

const API_URL = 'http://localhost:8000/api/medicos';
const ESPECIALIDADE_URL = 'http://localhost:8000/api/especialidades';



export default function MedicosPage() {
  
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [selected, setSelected] = useState<Medico | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    return headers;
  };

  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, []);

  // =============================
  // BUSCAR ESPECIALIDADES
  // =============================
  const fetchEspecialidades = async () => {
    try {
      const res = await fetch(ESPECIALIDADE_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error("Erro ao buscar especialidades");
      setEspecialidades(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // =============================
  // BUSCAR MÉDICOS
  // =============================
  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error("Erro ao buscar médicos");
      setMedicos(await res.json());
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar médicos");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ABRIR MODAL
  // =============================
  const abrirModal = (medico?: Medico) => {
    setSelected(
      medico || { id: 0, nome: '', cpf: '', CRM: '', status: true, especialidade_id: 0 }
    );
    setOpenModal(true);
  };

  // =============================
  // SALVAR (POST / PUT)
  // =============================
  const salvarMedico = async (medico: Medico) => {
    if (!medico.nome.trim() || !medico.cpf.trim() || !medico.CRM.trim() || !medico.especialidade_id) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    // *OBJETO LIMPO* (SEM especialidade)
    const payload = {
      nome: medico.nome,
      cpf: medico.cpf,
      CRM: medico.CRM,
      status: medico.status,
      especialidade_id: medico.especialidade_id,
    };

    const token = localStorage.getItem("token");

    try {
      let res: Response;

      if (medico.id === 0) {
        // CRIAR
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
      } else {
        // EDITAR
        console.log(payload)
        res = await fetch(`${API_URL}/${medico.id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData?.errors) {
          const mensagens = Object.entries(errorData.errors)
            .map(([campo, mensagens]) => `${campo}: ${(mensagens as string[]).join(', ')}`)
            .join('\n');
          alert(`Erro de validação:\n${mensagens}`);
        } else {
          alert("Erro ao salvar médico");
        }
        return;
      }

      await res.json();
      fetchMedicos();
      setOpenModal(false);
      setSelected(null);

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar médico");
    }
  };

  // =============================
  // ALTERAR STATUS
  // =============================
  const toggleStatus = async (medico: Medico) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/${medico.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: !medico.status }),
      });
      if (!res.ok) throw new Error("Erro ao alterar status");

      fetchMedicos();
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
          <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Listagem de Médicos</h2>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.listagem}>
            {medicos.map(medico => (
              <div key={medico.id} className={styles.card}>
                <div className={styles.info}>
                  <p><b>Nome:</b> {medico.nome}</p>
                  <p><b>CPF:</b> {medico.cpf}</p>
                  <p><b>CRM:</b> {medico.CRM}</p>
                  <p><b>Especialidade:</b> {medico.especialidade?.nome || '---'}</p>
                  <p>
                    <b>Status:</b>{' '}
                    <span className={medico.status ? styles.ativo : styles.inativo}>
                      {medico.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>

                <div className={styles.botoes}>
                  <button className={styles.btnEdit} onClick={() => abrirModal(medico)}>Editar</button>
                  <button className={styles.btnToggle} onClick={() => toggleStatus(medico)}>
                    {medico.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {openModal && selected && (
          <ModalMedico
            medico={selected}
            especialidades={especialidades}
            onSalvar={salvarMedico}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </>
    </ProtectedRoute>

  );
}

// =============================
// COMPONENTE DO MODAL
// =============================
function ModalMedico({
  medico,
  especialidades,
  onSalvar,
  onCancelar
}: {
  medico: Medico;
  especialidades: Especialidade[];
  onSalvar: (esp: Medico) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(medico.nome);
  const [cpf, setCpf] = useState(medico.cpf);
  const [CRM, setCRM] = useState(medico.CRM);
  const [especialidade_id, setEspecialidadeId] = useState(medico.especialidade_id);

  const salvar = () =>
    onSalvar({ ...medico, nome, cpf, CRM, especialidade_id });

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{medico.id === 0 ? 'Novo Médico' : 'Editar Médico'}</h2>

        <label>Nome*</label>
        <input value={nome} onChange={e => setNome(e.target.value)} />

        <label>CPF*</label>
        <input value={cpf} onChange={e => setCpf(e.target.value)} />

        <label>CRM*</label>
        <input value={CRM} onChange={e => setCRM(e.target.value)} />

        <label>Especialidade*</label>
        <select value={especialidade_id} onChange={e => setEspecialidadeId(Number(e.target.value))}>
          <option value={0}>Selecione...</option>
          {especialidades.map(e => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancelar}>Cancelar</button>
          <button className={styles.saveBtn} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
