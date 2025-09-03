'use client';
import React, { useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from './tipoConsulta.module.css';

type TipoConsulta = {
  id: number;
  nome: string;
  ativo: boolean;
};

let nextId = 4;

export default function TipoConsultaPage() {
  const [tipos, setTipos] = useState<TipoConsulta[]>([
    { id: 1, nome: 'Clínico Geral', ativo: true },
    { id: 2, nome: 'Pediatria', ativo: true },
    { id: 3, nome: 'Dermatologia', ativo: false },
  ]);

  const [selected, setSelected] = useState<TipoConsulta | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const abrirModal = (tipo?: TipoConsulta) => {
    setSelected(tipo || { id: 0, nome: '', ativo: true });
    setOpenModal(true);
  };

  const salvarTipo = (tipo: TipoConsulta) => {
    if (!tipo.nome.trim()) {
      alert('Preencha o nome.');
      return;
    }

    if (tipo.id === 0) {
      // Novo tipo
      setTipos(prev => [...prev, { ...tipo, id: nextId++, ativo: true }]);
    } else {
      // Editar tipo
      setTipos(prev => prev.map(t => t.id === tipo.id ? tipo : t));
    }

    setOpenModal(false);
    setSelected(null);
  };

  const toggleAtivo = (id: number) => {
    setTipos(prev => prev.map(t => t.id === id ? { ...t, ativo: !t.ativo } : t));
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Tipos de Consulta</h2>
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar tipos de consulta..." />
          <button>🔍</button>
        </div>

        <div>
          {tipos.map(tipo => (
            <div key={tipo.id} className={styles.card}>
              <div>
                <strong>{tipo.nome}</strong>
                <p>Status: <span className={tipo.ativo ? styles.ativo : styles.inativo}>
                  {tipo.ativo ? 'Ativo' : 'Inativo'}
                </span></p>
              </div>
              <div className={styles.botoes}>
                <button className={styles.btnDetails} onClick={() => abrirModal(tipo)}>Editar</button>
                <button className={styles.btnToggle} onClick={() => toggleAtivo(tipo.id)}>
                  {tipo.ativo ? 'Inativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.floatingBtn} onClick={() => abrirModal()}>➕ Novo</button>

        {openModal && selected && (
          <ModalTipoConsulta
            tipo={selected}
            onSalvar={salvarTipo}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </>
  );
}

function ModalTipoConsulta({ tipo, onSalvar, onCancelar }: {
  tipo: TipoConsulta;
  onSalvar: (tipo: TipoConsulta) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(tipo.nome);

  const salvar = () => onSalvar({ ...tipo, nome });

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{tipo.id === 0 ? 'Novo Tipo de Consulta' : 'Editar Tipo de Consulta'}</h2>

        <label className={styles.modalLabel}>Nome</label>
        <input
          className={styles.modalInput}
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          autoFocus
        />

        <div className={styles.modalButtons}>
          <button className={styles.buttonClose} onClick={onCancelar}>Cancelar</button>
          <button className={styles.buttonSubmit} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
