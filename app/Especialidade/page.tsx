'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css';
import Swal from 'sweetalert2';
import ProtectedRoute from '../components/auth/protecetroute';

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

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  };

  // LISTAGEM
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

  // MODAL DE CRIAÇÃO / EDIÇÃO
  const abrirModal = async (esp?: Especialidade) => {
    const item = esp || {
      id: 0,
      nome: '',
      descricao: '',
      area: '',
      status: true,
    };

    const { value: dados } = await Swal.fire({
      title: item.id === 0 ? 'Nova Especialidade' : 'Editar Especialidade',
      html: `
        <div style="display:flex;flex-direction:column;gap:10px;text-align:left">
          <label>Nome*</label>
          <input id="nome" class="swal2-input" value="${item.nome || ''}" />

          <label>Descrição</label>
          <input id="descricao" class="swal2-input" value="${item.descricao || ''}" />

          <label>Área*</label>
          <select id="area" class="swal2-input">
            <option value="">Selecione...</option>
            <option value="Médica" ${item.area === 'Médica' ? 'selected' : ''}>Médica</option>
            <option value="Enfermagem" ${item.area === 'Enfermagem' ? 'selected' : ''}>Enfermagem</option>
            <option value="Odontologia" ${item.area === 'Odontologia' ? 'selected' : ''}>Odontologia</option>
            <option value="Fisioterapia" ${item.area === 'Fisioterapia' ? 'selected' : ''}>Fisioterapia</option>
            <option value="Psicologia" ${item.area === 'Psicologia' ? 'selected' : ''}>Psicologia</option>
            <option value="Outros" ${item.area === 'Outros' ? 'selected' : ''}>Outros</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        const nome = (document.getElementById('nome') as HTMLInputElement).value;
        const descricao = (document.getElementById('descricao') as HTMLInputElement).value;
        const area = (document.getElementById('area') as HTMLSelectElement).value;

        if (!nome.trim() || !area.trim()) {
          Swal.showValidationMessage('Preencha nome e área.');
          return false;
        }

        return { nome, descricao, area };
      },
    });

    if (!dados) return;

    salvarEspecialidade({
      ...item,
      nome: dados.nome,
      descricao: dados.descricao,
      area: dados.area,
    });
  };

  // SALVAR (CRIAR / EDITAR)
  const salvarEspecialidade = async (esp: Especialidade) => {
    const confirm = await Swal.fire({
      title: esp.id === 0 ? 'Confirmar cadastro?' : 'Confirmar alterações?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      let res: Response;

      if (esp.id === 0) {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(esp),
        });
      } else {
        res = await fetch(`${API_URL}/${esp.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(esp),
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

      fetchEspecialidades();
    } catch {
      Swal.fire('Erro', 'Não foi possível salvar.', 'error');
    }
  };

  // ATIVAR / INATIVAR COM CONFIRMAÇÃO
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
        </main>
      </>
    </ProtectedRoute>
  );
}
