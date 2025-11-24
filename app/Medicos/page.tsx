'use client';

import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
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
      Swal.fire("Erro", "Erro ao carregar especialidades.", "error");
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
      Swal.fire("Erro", "Erro ao carregar médicos.", "error");
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
      Swal.fire("Atenção", "Preencha todos os campos obrigatórios.", "warning");
      return;
    }

    const payload = {
      nome: medico.nome,
      cpf: medico.cpf,
      CRM: medico.CRM,
      status: medico.status,
      especialidade_id: medico.especialidade_id,
    };

    try {
      let res: Response;

      if (medico.id === 0) {
        res = await fetch(API_URL, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/${medico.id}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData?.errors) {
          const mensagens = Object.entries(errorData.errors)
            .map(([campo, msgs]) => `${campo}: ${(msgs as string[]).join(", ")}`)
            .join("<br>");
          Swal.fire("Erro de validação", mensagens, "error");
        } else {
          Swal.fire("Erro", "Erro ao salvar médico.", "error");
        }
        return;
      }

      await res.json();
      fetchMedicos();
      setOpenModal(false);
      setSelected(null);

      Swal.fire("Sucesso", "Médico salvo com sucesso!", "success");

    } catch (err) {
      Swal.fire("Erro", "Erro ao salvar médico.", "error");
    }
  };

  // =============================
  // ALTERAR STATUS (COM ROTA CORRETA)
  // =============================
  const toggleStatus = async (medico: Medico) => {
    const acao = medico.status ? "inativar" : "ativar";

    const confirmar = await Swal.fire({
      title: `Deseja realmente ${acao}?`,
      text: `O médico "${medico.nome}" será ${acao}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: medico.status ? "Inativar" : "Ativar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${medico.id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Erro", data.error || "Falha ao alterar status.", "error");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Status atualizado!",
        text: `O médico agora está ${data.status ? "Ativo" : "Inativo"}.`,
        showConfirmButton: false,
        timer: 1500,
      });

      fetchMedicos();

    } catch (err) {
      Swal.fire("Erro", "Erro ao alterar status.", "error");
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

  const salvar = () => onSalvar({ ...medico, nome, cpf, CRM, especialidade_id });

  return (
    <ProtectedRoute allowedRoles={"admin"}>
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
    </ProtectedRoute>
  );
}
