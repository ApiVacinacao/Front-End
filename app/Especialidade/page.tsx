'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css';

type Especialidade = {
  id: number;
  nome: string;
  descricao: string;
  area: string;
  status: boolean;
};

const API_URL = 'http://localhost:8001/api/especialidades';

export default function EspecialidadePage() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [selected, setSelected] = useState<Especialidade | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEspecialidades(); }, []);

  const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token
      ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  };

  const fetchEspecialidades = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error("Erro ao buscar especialidades");
      const data = await res.json();
      setEspecialidades(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar especialidades");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (esp?: Especialidade) => {
    setSelected(esp || { id: 0, nome: '', descricao: '', area: '', status: true });
    setOpenModal(true);
  };

  const salvarEspecialidade = async (esp: Especialidade) => {
    if (!esp.nome.trim() || !esp.area.trim()) {
      alert('Preencha nome e área.');
      return;
    }

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

      if (!res.ok) throw new Error("Erro ao salvar especialidade");

      await res.json();
      fetchEspecialidades();
      setOpenModal(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar especialidade");
    }
  };

  const toggleStatus = async (esp: Especialidade) => {
    try {
      const res = await fetch(`${API_URL}/${esp.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: !esp.status }),
      });
      if (!res.ok) throw new Error("Erro ao alterar status");
      fetchEspecialidades();
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status");
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Especialidades</h2>
        </div>

        {loading ? <p>Carregando...</p> : (
          <div>
            {especialidades.map(esp => (
              <div key={esp.id} className={styles.card}>
                <div>
                  <strong>{esp.nome}</strong>
                  <p>{esp.descricao}</p>
                  <p><b>Área:</b> {esp.area}</p>
                  <p>Status: <span className={esp.status ? styles.ativo : styles.inativo}>
                    {esp.status ? 'Ativo' : 'Inativo'}
                  </span></p>
                </div>
                <div className={styles.botoes}>
                  <button className={styles.btnDetails} onClick={() => abrirModal(esp)}>Editar</button>
                  <button className={styles.btnToggle} onClick={() => toggleStatus(esp)}>
                    {esp.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {openModal && selected && (
          <ModalEspecialidade
            especialidade={selected}
            onSalvar={salvarEspecialidade}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </>
  );
}

function ModalEspecialidade({ especialidade, onSalvar, onCancelar }: {
  especialidade: Especialidade;
  onSalvar: (esp: Especialidade) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(especialidade.nome);
  const [descricao, setDescricao] = useState(especialidade.descricao);
  const [area, setArea] = useState(especialidade.area);

  const salvar = () => onSalvar({ ...especialidade, nome, descricao, area });

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{especialidade.id === 0 ? 'Nova Especialidade' : 'Editar Especialidade'}</h2>

        <label className={styles.modalLabel}>Nome*</label>
        <input className={styles.modalInput} value={nome} onChange={e => setNome(e.target.value)} />

        <label className={styles.modalLabel}>Descrição</label>
        <input className={styles.modalInput} value={descricao} onChange={e => setDescricao(e.target.value)} />

        <label className={styles.modalLabel}>Área*</label>
        <select className={styles.modalInput} value={area} onChange={e => setArea(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="Medica">Médica</option>
          <option value="Enfermagem">Enfermagem</option>
          <option value="Odontologia">Odontologia</option>
          <option value="Fisioterapia">Fisioterapia</option>
          <option value="Psicologia">Psicologia</option>
          <option value="Outros">Outros</option>
        </select>

        <div className={styles.modalButtons}>
          <button className={styles.buttonClose} onClick={onCancelar}>Cancelar</button>
          <button className={styles.buttonSubmit} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
