'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css';
import ProtectedRoute from '../components/auth/protecetroute';
import Swal from "sweetalert2";

interface Local {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  status: boolean;
}

const API_URL = 'http://localhost:8000/api/localAtendimentos';

export default function LocaisPage() {
  const [locais, setLocais] = useState<Local[]>([]);
  const [selected, setSelected] = useState<Local | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token) headers.append("Authorization", `Bearer ${token}`);
    return headers;
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  const fetchLocais = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Erro", data.message || "Erro ao carregar locais", "error");
        return;
      }

      setLocais(data);

    } catch (err) {
      Swal.fire("Erro", "Erro ao carregar locais", "error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  // ✅ CONFIRMAÇÃO E ALTERAÇÃO DE STATUS
  // -----------------------------------------------------------
  const toggleStatus = async (local: Local) => {
    const acao = local.status ? "inativar" : "ativar";

    const confirmar = await Swal.fire({
      title: `Confirmar ${acao}?`,
      text: `Você realmente deseja ${acao} o local "${local.nome}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      reverseButtons: true,
    });

    if (!confirmar.isConfirmed) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/${local.id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Erro", data.error || "Falha ao alterar status", "error");
        return;
      }

      Swal.fire(
        "Atualizado!",
        `O local agora está ${data.status ? "Ativo" : "Inativo"}.`,
        "success"
      );

      fetchLocais();

    } catch (err) {
      Swal.fire("Erro", "Falha inesperada ao alterar status", "error");
    }
  };

  // -----------------------------------------------------------
  // ✅ SALVAR LOCAL + ERROS DE VALIDAÇÃO
  // -----------------------------------------------------------
const salvarLocal = async (local: Local) => {
  if (!local.nome.trim() || !local.endereco.trim() || !local.telefone.trim()) {
    Swal.fire("Atenção", "Preencha todos os campos obrigatórios.", "warning");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/${local.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(local),
    });

    const data = await res.json();

    // -----------------------------------------------------------
    // ❌ TRATAMENTO DE ERRO DO BACKEND
    // -----------------------------------------------------------
    if (!res.ok) {

      // 🔥 1 — Erros de validação (422)
      if (data.errors) {
        const mensagens = Object.values(data.errors)
          .flat()
          .map((msg: any) => `<li>${msg}</li>`)
          .join("");

        Swal.fire({
          icon: "error",
          title: "Erros de validação",
          html: `<ul style="text-align:left;">${mensagens}</ul>`,
        });
        return;
      }

      // 🔥 2 — Erros personalizados enviados pelo backend
      if (data.error) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: data.error,
        });
        return;
      }

      // 🔥 3 — Mensamentos padrões ("message")
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: data.message || "Erro inesperado ao atualizar o local.",
      });

      return;
    }

    // -----------------------------------------------------------
    // ✔ SUCESSO
    // -----------------------------------------------------------
    Swal.fire({
      icon: "success",
      title: "Local atualizado com sucesso!",
      timer: 1400,
      showConfirmButton: false,
    });

    fetchLocais();
    setOpenModal(false);
    setSelected(null);

  } catch (err) {
    Swal.fire("Erro", "Falha inesperada ao salvar", "error");
  }
};

  const abrirModal = (local?: Local) => {
    setSelected(local || { id: 0, nome: '', endereco: '', telefone: '', status: true });
    setOpenModal(true);
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2 style={{ textAlign: 'center', width: '100%' }}>📍 Locais de Atendimento</h2>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.listagem} style={{ overflowX: 'auto' }}>
            {locais.map(local => (
              <div key={local.id} className={styles.card}>
                <div className={styles.info}>
                  <p><b>Nome:</b> {local.nome}</p>
                  <p><b>Endereço:</b> {local.endereco}</p>
                  <p><b>Telefone:</b> {local.telefone}</p>
                  <p>
                    <b>Status:</b>{' '}
                    <span className={local.status ? styles.ativo : styles.inativo}>
                      {local.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>

                <div className={styles.botoes}>
                  <button className={styles.btnEdit} onClick={() => abrirModal(local)}>Editar</button>
                  <button className={styles.btnToggle} onClick={() => toggleStatus(local)}>
                    {local.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {openModal && selected && (
          <ModalLocal
            local={selected}
            onSalvar={salvarLocal}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </ProtectedRoute >
  );
}


// ===================================================================
// 📌 MODAL COMPLETO
// ===================================================================
function ModalLocal({
  local,
  onSalvar,
  onCancelar
}: {
  local: Local;
  onSalvar: (local: Local) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(local.nome);
  const [endereco, setEndereco] = useState(local.endereco);
  const [telefone, setTelefone] = useState(local.telefone);

  const salvar = () => onSalvar({ ...local, nome, endereco, telefone });

  return (
    <ProtectedRoute allowedRoles={"admin"}>
      <div className={styles.modalOverlay} onClick={onCancelar}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <h2>{local.id === 0 ? 'Novo Local' : 'Editar Local'}</h2>

          <label>Nome*</label>
          <input value={nome} onChange={e => setNome(e.target.value)} />

          <label>Endereço*</label>
          <input value={endereco} onChange={e => setEndereco(e.target.value)} />

          <label>Telefone*</label>
          <input value={telefone} onChange={e => setTelefone(e.target.value)} />

          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={onCancelar}>Cancelar</button>
            <button className={styles.saveBtn} onClick={salvar}>Salvar</button>
          </div>
        </div>
      </div>
    </ProtectedRoute >
  );
}
