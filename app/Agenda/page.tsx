"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/navbar/page";
import styles from "./AgendaConsulta.module.css";
import axios from "axios";

interface Agendamento {
  id: number;
  data: string;
  hora: string;
  status: boolean;
}

export default function AgendaConsulta() {
  const [consultas, setConsultas] = useState<Agendamento[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Campos do formulário
  const [idEdicao, setIdEdicao] = useState<number | null>(null);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const api = axios.create({
    baseURL: "http://localhost:8001/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // CARREGA LISTA DE AGENDAMENTOS
  useEffect(() => {
    listarConsultas();
  }, []);

  const listarConsultas = async () => {
    try {
      const r = await api.get("/agendamentos");
      setConsultas(r.data);
    } catch (err) {
      alert("Erro ao carregar agendamentos.");
    }
  };

  // CRIAR AGENDAMENTO
  const criarAgendamento = async () => {
    if (!data || !hora) {
      alert("Preencha data e hora!");
      return;
    }

    try {
      await api.post("/agendamentos", {
        data,
        hora,
        user_id: 1,
        medico_id: 1,
        local_atendimento_id: 1,
        tipo_consulta_id: 1,
      });

      alert("Agendamento criado!");
      limparFormulario();
      listarConsultas();
    } catch (err) {
      alert("Erro ao criar agendamento");
    }
  };

  // ABRIR MODAL DE EDIÇÃO
  const abrirEdicao = (c: Agendamento) => {
    setIdEdicao(c.id);
    setData(c.data);
    setHora(c.hora);
    setModalOpen(true);
  };

  // SALVAR EDIÇÃO
  const salvarEdicao = async () => {
    if (!idEdicao) return;

    try {
      await api.put(`/agendamentos/${idEdicao}`, {
        data,
        hora,
        user_id: 1,
        medico_id: 1,
        local_atendimento_id: 1,
        tipo_consulta_id: 1,
      });

      alert("Consulta atualizada!");
      setModalOpen(false);
      limparFormulario();
      listarConsultas();
    } catch (err) {
      alert("Erro ao atualizar agendamento");
    }
  };

  // TROCAR STATUS (ATIVAR / INATIVAR)
  const trocarStatus = async (id: number) => {
    try {
      await api.patch(`/agendamentos/${id}/toggle-status`);
      listarConsultas();
    } catch (err) {
      alert("Erro ao trocar status");
    }
  };

  const limparFormulario = () => {
    setData("");
    setHora("");
    setIdEdicao(null);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className={styles.container}>
        <h1 className={styles.header}>Agendar Consulta</h1>

        {/* Formulário */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Data</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Hora</label>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={styles.input} />
          </div>
        </div>

        <button className={styles.button} onClick={criarAgendamento}>
          Criar Agendamento
        </button>

        {/* Lista */}
        <h2 className={styles.header}>Consultas Agendadas</h2>

        <div className={styles.consultasList}>
          {consultas.map((c) => (
            <div key={c.id} className={styles.consultaCard}>
              <p><strong>Data:</strong> {c.data}</p>
              <p><strong>Hora:</strong> {c.hora}</p>
              <p><strong>Status:</strong> {c.status ? "Ativo" : "Inativo"}</p>

              <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => abrirEdicao(c)}>✏️ Editar</button>
                <button className={styles.btnToggle} onClick={() => trocarStatus(c.id)}>
                  🔄 Trocar Status
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de edição */}
        {modalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Editar Agendamento</h3>

              <div className={styles.formGroup}>
                <label>Data</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label>Hora</label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={styles.input} />
              </div>

              <button className={styles.button} onClick={salvarEdicao}>Salvar</button>
              <button className={styles.btnCancel} onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
