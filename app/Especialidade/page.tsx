'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css';
import EspecialidadeModal from './EditEspecialidade';
import ProtectedRoute from '../components/auth/protecetroute';
import Swal from 'sweetalert2';

type Especialidade = {
  id: number;
  nome: string;
  descricao: string;
  area: string;
  status: boolean;
};

const API_URL = 'http://localhost:8000/api/especialidades';

export default function EspecialidadePage() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [espSelecionada, setEspSelecionada] = useState<Especialidade | undefined>();

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  };

  const fetchEspecialidades = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erro ao buscar especialidades');

      const data = await res.json();
      setEspecialidades(data);
    } catch (err) {
      Swal.fire('Erro', 'Não foi possível carregar as especialidades.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal (nova ou edição)
  const abrirModal = (esp?: Especialidade) => {
    setEspSelecionada(esp);
    setModalOpen(true);
  };

  // Salvar via modal
  const salvarModal = async (dados: Omit<Especialidade, 'id'>) => {
    try {
      let res: Response;

      if (espSelecionada?.id) {
        // Editar
        res = await fetch(`${API_URL}/${espSelecionada.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ ...espSelecionada, ...dados }),
        });
      } else {
        // Criar
        res = await fetch(API_URL, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ id: 0, ...dados }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data.message ||
          data.error ||
          (data.errors ? Object.values(data.errors).flat().join("\n") : "Erro ao salvar");
        Swal.fire("Erro", msg, "error");
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Salvo com sucesso!',
        showConfirmButton: false,
        timer: 1500,
      });

      setModalOpen(false);
      fetchEspecialidades();
    } catch {
      Swal.fire('Erro', 'Não foi possível salvar.', 'error');
    }
  };

  // Ativar / inativar
  const toggleStatus = async (esp: Especialidade) => {
    const acao = esp.status ? "inativar" : "ativar";

    const confirmar = await Swal.fire({
      title: `Confirmar ${acao}?`,
      text: `Você realmente deseja ${acao} a especialidade "${esp.nome}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${esp.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: !esp.status }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Erro", data.error || "Falha ao alterar status", "error");
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Status atualizado',
        text: `A especialidade agora está ${!esp.status ? "Ativa" : "Inativa"}.`,
        showConfirmButton: false,
        timer: 1500,
      });

      fetchEspecialidades();
    } catch {
      Swal.fire('Erro', 'Não foi possível alterar o status.', 'error');
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
      <>
        <Navbar />

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h2>Listagem de Especialidades</h2>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className={styles.listagem}>
              {especialidades.map(esp => (
                <div key={esp.id} className={styles.card}>
                  <div className={styles.info}>
                    <p><b>Nome:</b> {esp.nome}</p>
                    <p><b>Descrição:</b> {esp.descricao}</p>
                    <p><b>Área:</b> {esp.area}</p>
                    <p>
                      <b>Status:</b>{' '}
                      <span className={esp.status ? styles.ativo : styles.inativo}>
                        {esp.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </p>
                  </div>

                  <div className={styles.botoes}>
                    <button className={styles.btnEdit} onClick={() => abrirModal(esp)}>
                      Editar
                    </button>

                    <button className={styles.btnToggle} onClick={() => toggleStatus(esp)}>
                      {esp.status ? 'Inativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {modalOpen && (
            <EspecialidadeModal
              especialidade={espSelecionada}
              onClose={() => setModalOpen(false)}
              onSave={salvarModal}
            />
          )}
        </main>
      </>
    </ProtectedRoute>
  );
}